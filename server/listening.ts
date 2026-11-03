import type { ListenedArtist, ListenedTrack, Listening } from "../shared/api.ts";
import { env, LASTFM_USER } from "./config.ts";
import { fetchJson } from "./fetch.ts";

const API = "https://ws.audioscrobbler.com/2.0/";

/** Songs in "recently played", after repeats are removed */
const RECENT = 20;
const TOP_ARTISTS = 10;

/**
 * Plays fetched: Last.fm's maximum per request. Enough to find 20 different songs despite
 * the repeat bug, and roughly a week of listening for top artists.
 */
const PLAYS = 200;

interface LastfmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega" | "";
}

export interface RecentTracksResponse {
  recenttracks: {
    /** a single object rather than a list when there's only one */
    track?: LastfmTrack[] | LastfmTrack;
  };
}

interface LastfmTrack {
  name: string;
  url: string;
  artist: { "#text": string };
  album?: { "#text": string };
  image?: LastfmImage[];
  /** absent while the track is playing */
  date?: { uts: string };
  "@attr"?: { nowplaying?: "true" };
}

const list = <T>(items: T[] | T | undefined): T[] =>
  items === undefined ? [] : Array.isArray(items) ? items : [items];

/** The largest real cover; Last.fm fills missing art with a placeholder star image */
function cover(images: LastfmImage[] = []): string | undefined {
  const order = ["extralarge", "large", "medium", "small"];
  const best = images
    .filter(
      (image) => image["#text"] && !image["#text"].includes("2a96cbd8b46e442fc41c2b86b821562f"),
    )
    .sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size))[0];

  return best?.["#text"];
}

/**
 * Plays, most recent first. A track that's playing right now is left out: the data is
 * cached for hours, far longer than a song plays, so it shows up once it's scrobbled.
 */
export function parsePlays(response: RecentTracksResponse): ListenedTrack[] {
  return list(response.recenttracks.track).flatMap((track): ListenedTrack[] => {
    if (track["@attr"]?.nowplaying === "true" || !track.date) return [];

    const album = track.album?.["#text"];
    const image = cover(track.image);

    return [
      {
        name: track.name,
        artist: track.artist["#text"],
        ...(album && { album }),
        url: track.url,
        ...(image && { image }),
        playedAt: new Date(Number(track.date.uts) * 1000).toISOString(),
      },
    ];
  });
}

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, " ").trim();
const songKey = (play: ListenedTrack) => `${normalize(play.artist)}\u0000${normalize(play.name)}`;

/**
 * Recently played: each song once, at its most recent play. My Last.fm history logs some
 * songs dozens of times in a row that I only played once.
 */
export function recentSongs(plays: ListenedTrack[], limit = RECENT): ListenedTrack[] {
  const seen = new Set<string>();

  return plays
    .filter((play) => {
      const key = songKey(play);

      if (seen.has(key)) return false;
      seen.add(key);

      return true;
    })
    .slice(0, limit);
}

/**
 * Most played artists across `plays`. A song logged several times in a row counts once
 * (the repeat bug); playing it again later, after something else, counts again.
 */
export function topArtists(plays: ListenedTrack[], limit = TOP_ARTISTS): ListenedArtist[] {
  const artists = new Map<string, ListenedArtist & { lastPlayed: number }>();
  let previous: string | undefined;

  for (const play of plays) {
    const key = songKey(play);

    if (key === previous) continue;
    previous = key;

    const id = normalize(play.artist);
    const artist = artists.get(id) ?? {
      name: play.artist,
      url: `https://www.last.fm/music/${encodeURIComponent(play.artist).replace(/%20/g, "+")}`,
      plays: 0,
      lastPlayed: Date.parse(play.playedAt),
    };

    artist.plays += 1;
    artists.set(id, artist);
  }

  return [...artists.values()]
    .sort((a, b) => b.plays - a.plays || b.lastPlayed - a.lastPlayed)
    .slice(0, limit)
    .map(({ name, url, plays: count }) => ({ name, url, plays: count }));
}

function apiUrl(key: string): string {
  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: LASTFM_USER,
    api_key: key,
    format: "json",
    limit: String(PLAYS),
  });

  return `${API}?${params}`;
}

export async function getListening(): Promise<Listening> {
  const key = env("LASTFM_API_KEY");

  if (!key) throw new Error("LASTFM_API_KEY is not set");

  // Last.fm's error replies come with an error status, so a failure throws
  const plays = parsePlays(await fetchJson<RecentTracksResponse>(apiUrl(key)));

  return { recent: recentSongs(plays), topArtists: topArtists(plays) };
}
