import type { ListenedArtist, ListenedTrack, Listening } from "../shared/api.ts";
import { env, LASTFM_USER } from "./config.ts";
import { fetchJson } from "./fetch.ts";

const API = "https://ws.audioscrobbler.com/2.0/";

/** Songs in "recently played", after repeats are removed */
const RECENT = 20;
const TOP_ARTISTS = 10;
/** Style tags shown per artist */
const TAGS = 3;
/** Last.fm weighs each artist's tags 0–100; below this, few listeners agree */
const MIN_TAG_WEIGHT = 10;

/**
 * Tags that describe listeners rather than the music. Nationalities are left out too:
 * they're where an artist is from, not how they sound.
 */
const NOT_STYLES = new Set([
  "seen live",
  "favorite",
  "favorites",
  "favourite",
  "favourites",
  "love",
  "loved",
  "awesome",
  "beautiful",
  "albums i own",
  "my music",
  "spotify",
  "all",
  "under 2000 listeners",
  "american",
  "british",
  "uk",
  "usa",
  "english",
  "canadian",
  "australian",
  "german",
  "french",
  "swedish",
  "irish",
  "scottish",
  "dutch",
  "norwegian",
  "japanese",
  "korean",
]);

/**
 * Plays fetched: Last.fm's maximum per request. Enough to find 20 different songs despite
 * the repeat bug, and roughly a week of listening for top artists.
 */
const PLAYS = 200;

interface LastfmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega" | "";
}

export interface TopTagsResponse {
  toptags?: {
    /** a single object rather than a list when there's only one */
    tag?: { name: string; count: number }[] | { name: string; count: number };
  };
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
 * Typographic hyphens and dashes (‐ ‑ ‒ – — − …) as a plain hyphen. Some scrobblers write
 * "T‐Pain" with U+2010, which Last.fm keeps as a separate artist from "T-Pain", with no
 * tags of its own, and doesn't autocorrect.
 */
export const plainDashes = (text: string) =>
  text.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");

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
        artist: plainDashes(track.artist["#text"]),
        ...(album && { album }),
        url: track.url,
        ...(image && { image }),
        playedAt: new Date(Number(track.date.uts) * 1000).toISOString(),
      },
    ];
  });
}

const normalize = (text: string) => plainDashes(text).toLowerCase().replace(/\s+/g, " ").trim();
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
  // tags are added afterwards, by getListening
  const artists = new Map<string, Omit<ListenedArtist, "tags"> & { lastPlayed: number }>();
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
    .map(({ name, url, plays: count }) => ({ name, url, plays: count, tags: [] }));
}

/** An artist's most-used tags that describe their music, strongest first */
export function parseTags(response: TopTagsResponse, artist: string, limit = TAGS): string[] {
  const seen = new Set<string>([normalize(artist)]);

  return list(response.toptags?.tag)
    .filter(({ count }) => count >= MIN_TAG_WEIGHT)
    .map(({ name }) => normalize(name))
    .filter((tag) => {
      if (!tag || NOT_STYLES.has(tag) || seen.has(tag)) return false;
      seen.add(tag);

      return true;
    })
    .slice(0, limit);
}

function apiUrl(params: Record<string, string>, key: string): string {
  return `${API}?${new URLSearchParams({ ...params, api_key: key, format: "json" })}`;
}

export async function getListening(): Promise<Listening> {
  const key = env("LASTFM_API_KEY");

  if (!key) throw new Error("LASTFM_API_KEY is not set");

  // Last.fm's error replies come with an error status, so a failure throws
  const plays = parsePlays(
    await fetchJson<RecentTracksResponse>(
      apiUrl({ method: "user.getrecenttracks", user: LASTFM_USER, limit: String(PLAYS) }, key),
    ),
  );
  const artists = topArtists(plays);

  // Tags are a nice-to-have: an artist whose tags don't load is shown without them
  const tags = await Promise.allSettled(
    artists.map(async ({ name }) =>
      parseTags(
        await fetchJson<TopTagsResponse>(
          apiUrl({ method: "artist.gettoptags", artist: name, autocorrect: "1" }, key),
        ),
        name,
      ),
    ),
  );

  return {
    recent: recentSongs(plays),
    topArtists: artists.map((artist, index) => {
      const result = tags[index];

      if (result?.status === "rejected")
        console.warn(`[listening] tags for ${artist.name}`, result.reason);

      return { ...artist, tags: result?.status === "fulfilled" ? result.value : [] };
    }),
  };
}
