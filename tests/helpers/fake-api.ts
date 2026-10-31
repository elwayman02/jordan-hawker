import { setFetcher } from "#utils/remote.ts";

import type { ApiResponse, Codes, Hella, Resume, Sound, Votes, Words } from "#shared/api.ts";

export const resume: Resume = {
  name: "Jordan Hawker",
  intro: ['<a href="https://github.com/elwayman02">GitHub</a>'],
  sections: [
    {
      title: "EXPERIENCE",
      blocks: [
        { kind: "line", level: "org", left: "<strong>LinkedIn</strong>", right: "Remote" },
        {
          kind: "line",
          level: "role",
          left: "<strong>Staff Software Engineer</strong>",
          right: "2018 - 2026",
        },
        { kind: "list", items: ["Re-architected <strong>46 repositories</strong>"] },
      ],
    },
    {
      title: "EDUCATION",
      blocks: [{ kind: "line", level: "org", left: "<strong>University of Illinois</strong>" }],
    },
  ],
  experience: [
    {
      org: "LinkedIn",
      location: "Remote",
      roles: [
        {
          title: "Staff Software Engineer",
          dates: "2018 - 2026",
          highlights: ["Re-architected 46 repositories"],
        },
      ],
    },
  ],
  original: { html: '<div class="doc-content"><p>Original doc</p></div>', css: "p { color: red }" },
  structured: true,
};

export const codes: Codes = {
  active: [
    {
      name: "ember-user-activity",
      description: "Ember Addon for tracking user activity & idling",
      url: "https://github.com/elwayman02/ember-user-activity",
      homepage: null,
      language: "JavaScript",
      topics: ["ember", "addon"],
      stars: 111,
      forks: 20,
      pushedAt: "2025-11-18T00:00:00Z",
      createdAt: "2015-01-01T00:00:00Z",
      score: 8.88,
      featured: false,
    },
  ],
  archive: [
    {
      name: "js-edgar",
      description: "Spies & stubs",
      url: "https://github.com/elwayman02/js-edgar",
      homepage: null,
      language: "JavaScript",
      topics: [],
      stars: 2,
      forks: 0,
      pushedAt: "2016-01-01T00:00:00Z",
      createdAt: "2015-01-01T00:00:00Z",
      score: 1.2,
      featured: false,
    },
  ],
};

export const sound: Sound = {
  tracks: [
    {
      id: "1323785659",
      title: "Panorama",
      url: "https://soundcloud.com/axlehellfire/panorama",
      publishedAt: "2022-08-12T00:00:00.000Z",
      duration: "03:15",
    },
  ],
  videos: [],
};

export const words: Words = {
  posts: [
    {
      slug: "187541610821",
      title: "ember-sinon-qunit v4",
      publishedAt: "2019-09-06T22:39:56.000Z",
      excerpt: "If you’re an Ember developer…",
      tags: ["ember"],
      url: "https://jordanhawker.tumblr.com/post/187541610821",
      body: "<p>If you’re an Ember developer, read on.</p>",
    },
  ],
};

export const hella: Hella = {
  posts: [
    {
      title: "Akashi White Oak",
      url: "https://www.helladrunk.com/akashi-white-oak",
      publishedAt: "2021-03-03T03:53:40.000Z",
      excerpt: "Smooth but lacking",
    },
  ],
};

const envelope = <T>(data: T): ApiResponse<T> => ({
  data,
  fetchedAt: new Date().toISOString(),
  stale: false,
});

const bluesky = {
  feed: [
    {
      post: {
        uri: "at://did:plc:abc/app.bsky.feed.post/3abc",
        author: { handle: "axle.jhawk.co" },
        record: {
          text: "Why don't we call mushroom omelettes shroomelettes?",
          createdAt: "2026-10-27T00:00:00Z",
        },
        likeCount: 3,
      },
    },
    {
      reason: { $type: "app.bsky.feed.defs#reasonRepost" },
      post: {
        uri: "at://did:plc:xyz/app.bsky.feed.post/3xyz",
        author: { handle: "someone.else" },
        record: { text: "A repost that should be hidden", createdAt: "2026-10-26T00:00:00Z" },
      },
    },
  ],
};

export const votes: Votes = {
  guides: [
    {
      slug: "2026-november-general",
      label: "November 2026 General",
      election: "2026-11-01",
      title: "2026 Progressive Voter Guide - Nov General",
      subtitle: "California, Alameda County, and Hayward",
      url: "https://docs.google.com/document/d/new/edit",
      body:
        '<p>Do your own research.</p><h3 id="propositions">Propositions</h3>' +
        '<h4 id="proposition-1">Proposition 1: Affordable Housing <span class="pick pick--yes">yes</span></h4>' +
        '<p>See <a href="/votes/2024-march-primary">my 2024 guide</a>.</p>',
      outline: [
        {
          id: "propositions",
          title: "Propositions",
          items: [{ id: "proposition-1", title: "Proposition 1: Affordable Housing", pick: "yes" }],
        },
      ],
    },
    {
      slug: "2024-march-primary",
      label: "March 2024 Primary",
      election: "2024-03-01",
      title: "2024 Progressive Voter Guide - Mar Primary",
      url: "https://docs.google.com/document/d/old/edit",
      body: '<h3 id="federal">Federal Positions</h3><h4 id="president">President</h4>',
      outline: [
        {
          id: "federal",
          title: "Federal Positions",
          items: [{ id: "president", title: "President" }],
        },
      ],
    },
  ],
};

const routes: Record<string, unknown> = {
  "/api/resume": envelope(resume),
  "/api/codes": envelope(codes),
  "/api/sound": envelope(sound),
  "/api/words": envelope(words),
  "/api/hella": envelope(hella),
  "/api/votes": envelope(votes),
};

/** Serve fixture data for every remote source; `failing` paths respond 502 */
export function fakeApi({ failing = [] as string[] } = {}) {
  setFetcher((url) => {
    const path = url.startsWith("https://public.api.bsky.app") ? "bluesky" : url;
    const body = path === "bluesky" ? bluesky : routes[path];

    if (!body || failing.includes(path)) {
      return Promise.resolve(new Response(JSON.stringify({ error: "nope" }), { status: 502 }));
    }

    return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
  });
}

export function resetApi() {
  setFetcher();
}
