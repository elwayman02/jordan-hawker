import { afterEach, describe, expect, test, vi } from "vitest";

import { getListening, parseRecentTracks, type RecentTracksResponse } from "./listening.ts";

const art = (hash: string) =>
  (["small", "medium", "large", "extralarge"] as const).map((size) => ({
    size,
    "#text": `https://lastfm.freetls.fastly.net/i/u/${size === "extralarge" ? "300x300" : "64s"}/${hash}.jpg`,
  }));

// shaped like Last.fm's user.getrecenttracks JSON
const recent: RecentTracksResponse = {
  recenttracks: {
    track: [
      {
        name: "Pandora's Box",
        url: "https://www.last.fm/music/Beats+Antique/_/Pandora%27s+Box",
        artist: { "#text": "Beats Antique" },
        album: { "#text": "Collide" },
        image: art("abc"),
        "@attr": { nowplaying: "true" },
      },
      {
        name: "Left Alone (feat. Chet Faker)",
        url: "https://www.last.fm/music/Flume/_/Left+Alone",
        artist: { "#text": "Flume" },
        album: { "#text": "" },
        // Last.fm's placeholder when there's no art
        image: art("2a96cbd8b46e442fc41c2b86b821562f"),
        date: { uts: "1761997320" },
      },
    ],
  },
};

describe("parseRecentTracks", () => {
  test("marks what's playing now, and takes the largest real album art", () => {
    expect(parseRecentTracks(recent)).toEqual([
      {
        name: "Pandora's Box",
        artist: "Beats Antique",
        album: "Collide",
        url: "https://www.last.fm/music/Beats+Antique/_/Pandora%27s+Box",
        image: "https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg",
        nowPlaying: true,
      },
      {
        name: "Left Alone (feat. Chet Faker)",
        artist: "Flume",
        url: "https://www.last.fm/music/Flume/_/Left+Alone",
        playedAt: "2025-11-01T11:42:00.000Z",
        nowPlaying: false,
      },
    ]);
  });

  test("handles a single track (an object, not a list) and none at all", () => {
    const [first] = (recent.recenttracks.track as never[]) ?? [];

    expect(parseRecentTracks({ recenttracks: { track: first } })).toHaveLength(1);
    expect(parseRecentTracks({ recenttracks: {} })).toEqual([]);
  });

  test("keeps to the limit, even with a track playing on top of it", () => {
    expect(parseRecentTracks(recent, 1).map((track) => track.name)).toEqual(["Pandora's Box"]);
  });
});

describe("repeats", () => {
  const play = (name: string, artist: string, minute: number) => ({
    name,
    url: `https://www.last.fm/music/${artist}/_/${name}`,
    artist: { "#text": artist },
    date: { uts: String(1761997320 - minute * 60) },
  });

  test("each song shows once, at its most recent play", () => {
    const tracks = parseRecentTracks({
      recenttracks: {
        track: [
          { ...play("Rest", "Bruno Mars", 0), date: undefined, "@attr": { nowplaying: "true" } },
          // the scrobbling bug: one play logged over and over
          ...Array.from({ length: 30 }, (_, n) => play("Rest", "Bruno Mars", n + 1)),
          play("Dodo", "Emancipator", 40),
          play("rest ", "bruno  mars", 50),
          play("Rest", "Someone Else", 60),
          play("Dodo", "Emancipator", 70),
        ],
      },
    });

    expect(tracks.map((track) => [track.name, track.artist, track.nowPlaying])).toEqual([
      ["Rest", "Bruno Mars", true],
      ["Dodo", "Emancipator", false],
      // same title, different artist: a different song
      ["Rest", "Someone Else", false],
    ]);
  });

  test("counts the limit after repeats are removed", () => {
    const tracks = parseRecentTracks(
      {
        recenttracks: {
          track: [
            ...Array.from({ length: 40 }, (_, n) => play("Rest", "Bruno Mars", n)),
            ...Array.from({ length: 5 }, (_, n) => play(`Song ${n}`, "Lido", 50 + n)),
          ],
        },
      },
      3,
    );

    expect(tracks.map((track) => track.name)).toEqual(["Rest", "Song 0", "Song 1"]);
  });
});

describe("getListening", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  test("asks Last.fm for enough recent scrobbles to find 20 different songs", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(JSON.stringify(recent)))),
    );

    const listening = await getListening();
    const [url] = vi.mocked(fetch).mock.calls.map(([called]) => new URL(called as string));

    expect(listening.recent).toHaveLength(2);
    expect(url?.searchParams.get("method")).toBe("user.getrecenttracks");
    expect(url?.searchParams.get("user")).toBe("elwayman02");
    expect(url?.searchParams.get("limit")).toBe("200");
  });

  test("fails without a key, so the last good snapshot is served", async () => {
    vi.stubEnv("LASTFM_API_KEY", "");

    await expect(getListening()).rejects.toThrow("LASTFM_API_KEY is not set");
  });

  test("keeps the key out of error messages (they end up in logs)", async () => {
    vi.stubEnv("LASTFM_API_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(new Response('{"error":10,"message":"Invalid API key"}', { status: 403 })),
      ),
    );

    const error = await getListening().then(
      () => undefined,
      (caught: unknown) => caught as Error,
    );

    expect(error?.message).toContain("403");
    expect(error?.message).not.toContain("secret");
  });
});
