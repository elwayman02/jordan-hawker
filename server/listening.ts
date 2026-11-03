import type { ListenedTrack, Listening } from "../shared/api.ts";
import { env, LASTFM_USER } from "./config.ts";
import { fetchJson } from "./fetch.ts";

const API = "https://ws.audioscrobbler.com/2.0/";

/** Songs shown, after repeats are removed */
const RECENT = 20;

/**
 * Scrobbles fetched to find them: Last.fm's maximum per request. My history has runs of the
 * same song logged 20–40 times in a row (a scrobbling bug), so this leaves plenty of room.
 */
const SCROBBLES = 200;

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

export function parseRecentTracks(response: RecentTracksResponse, limit = RECENT): ListenedTrack[] {
  return list(response.recenttracks.track)
    .map((track): ListenedTrack => {
      const album = track.album?.["#text"];
      const image = cover(track.image);
      const nowPlaying = track["@attr"]?.nowplaying === "true";

      return {
        name: track.name,
        artist: track.artist["#text"],
        ...(album && { album }),
        url: track.url,
        ...(image && { image }),
        ...(!nowPlaying &&
          track.date && {
            playedAt: new Date(Number(track.date.uts) * 1000).toISOString(),
          }),
        nowPlaying,
      };
    })
    .filter(firstPlay())
    .slice(0, limit);
}

/**
 * Keeps each song once, at its most recent play (or while it's playing): my Last.fm history
 * repeats some songs dozens of times that I only played once.
 */
function firstPlay() {
  const seen = new Set<string>();

  return (track: ListenedTrack) => {
    const key = `${track.artist}\u0000${track.name}`.toLowerCase().replace(/\s+/g, " ").trim();

    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  };
}

function apiUrl(method: string, params: Record<string, string>, key: string): string {
  return `${API}?${new URLSearchParams({ method, user: LASTFM_USER, api_key: key, format: "json", ...params })}`;
}

export async function getListening(): Promise<Listening> {
  const key = env("LASTFM_API_KEY");

  if (!key) throw new Error("LASTFM_API_KEY is not set");

  // Last.fm's error replies are JSON too ({ error, message }), with an error status
  const recent = await fetchJson<RecentTracksResponse>(
    apiUrl("user.getrecenttracks", { limit: String(SCROBBLES) }, key),
  );

  return { recent: parseRecentTracks(recent) };
}
