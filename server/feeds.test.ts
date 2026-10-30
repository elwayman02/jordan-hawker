import { describe, expect, test } from "vitest";

import { parseHella } from "./hella.ts";
import { sanitizeArticle, unwrapLink } from "./html.ts";
import { parsePlaylistItems, parseSoundCloud, parseYouTubeFeed } from "./sound.ts";
import { toPost } from "./words.ts";

describe("parseSoundCloud", () => {
  test("reads tracks from the user RSS feed", () => {
    const xml = `<?xml version="1.0"?>
      <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"><channel>
        <item>
          <guid isPermaLink="false">tag:soundcloud,2010:tracks/1323785659</guid>
          <title>Panorama</title>
          <pubDate>Fri, 12 Aug 2022 00:00:00 +0000</pubDate>
          <link>https://soundcloud.com/axlehellfire/panorama</link>
          <itunes:duration>00:03:15</itunes:duration>
          <itunes:image href="https://i1.sndcdn.com/artworks-x-original.jpg"/>
        </item>
      </channel></rss>`;

    expect(parseSoundCloud(xml)).toEqual([
      {
        id: "1323785659",
        title: "Panorama",
        url: "https://soundcloud.com/axlehellfire/panorama",
        publishedAt: "2022-08-12T00:00:00.000Z",
        duration: "03:15",
        artwork: "https://i1.sndcdn.com/artworks-x-original.jpg",
        description: undefined,
      },
    ]);
  });
});

describe("parseYouTubeFeed", () => {
  test("reads videos from the playlist Atom feed", () => {
    const xml = `<?xml version="1.0"?>
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:videoId>6PhHhEO3vYg</yt:videoId>
          <title>Panorama (Music Video)</title>
          <published>2022-08-12T00:00:00+00:00</published>
        </entry>
      </feed>`;

    expect(parseYouTubeFeed(xml)).toEqual([
      {
        id: "6PhHhEO3vYg",
        title: "Panorama (Music Video)",
        url: "https://www.youtube.com/watch?v=6PhHhEO3vYg",
        publishedAt: "2022-08-12T00:00:00.000Z",
        thumbnail: "https://i.ytimg.com/vi/6PhHhEO3vYg/hqdefault.jpg",
      },
    ]);
  });
});

describe("parsePlaylistItems", () => {
  const item = (videoId: string, title: string, videoPublishedAt?: string) => ({
    snippet: { title, publishedAt: "2026-01-01T00:00:00Z", resourceId: { videoId } },
    contentDetails: videoPublishedAt ? { videoPublishedAt } : {},
  });

  test("lists playlist videos newest first, skipping private or deleted ones", () => {
    const videos = parsePlaylistItems({
      items: [
        item("older", "Slumber", "2020-05-09T00:00:00Z"),
        item("gone", "Private video"),
        item("newer", "Panorama", "2022-08-12T00:00:00Z"),
      ],
    });

    expect(videos.map((video) => [video.id, video.publishedAt])).toEqual([
      ["newer", "2022-08-12T00:00:00.000Z"],
      ["older", "2020-05-09T00:00:00.000Z"],
    ]);
  });
});

describe("parseHella", () => {
  test("returns the newest posts with plain-text excerpts", () => {
    const xml = `<rss><channel>
      <item><title><![CDATA[Older]]></title><link>https://www.helladrunk.com/older</link>
        <pubDate>Wed, 03 Mar 2021 03:53:40 GMT</pubDate><description><![CDATA[<p>Old pour</p>]]></description></item>
      <item><title><![CDATA[Newer]]></title><link>https://www.helladrunk.com/newer</link>
        <pubDate>Thu, 30 Dec 2021 21:04:31 GMT</pubDate><description><![CDATA[<h2>Big</h2><p>Smooth &amp; rich</p>]]></description></item>
    </channel></rss>`;

    expect(parseHella(xml, 1).posts).toEqual([
      {
        title: "Newer",
        url: "https://www.helladrunk.com/newer",
        publishedAt: "2021-12-30T21:04:31.000Z",
        excerpt: "Big Smooth & rich",
      },
    ]);
  });
});

describe("Tumblr posts", () => {
  test("uses the post id as the slug and sanitizes the body", () => {
    const post = toPost({
      id_string: "187541610821",
      type: "text",
      title: "Hello",
      body: '<h1>Heading</h1><p onclick="x()">Hi <a href="https://t.umblr.com/redirect">there</a></p><script>bad()</script>',
      post_url: "https://jordanhawker.tumblr.com/post/187541610821",
      timestamp: 1567809596,
      tags: ["ember"],
    });

    expect(post.slug).toBe("187541610821");
    expect(post.body).toBe(
      '<h2>Heading</h2><p>Hi <a href="https://t.umblr.com/redirect" rel="noopener noreferrer" target="_blank">there</a></p>',
    );
    expect(post.excerpt).toBe("Heading Hi there");
  });
});

describe("html helpers", () => {
  test("unwrapLink unwraps Google redirect links only", () => {
    expect(unwrapLink("https://www.google.com/url?q=https://example.com/a&sa=D")).toBe(
      "https://example.com/a",
    );
    expect(unwrapLink("https://example.com/b")).toBe("https://example.com/b");
  });

  test("sanitizeArticle drops empty paragraphs and unsafe attributes", () => {
    expect(sanitizeArticle('<p> </p><img src="https://x/y.png" onerror="z()">')).toBe(
      '<img src="https://x/y.png" loading="lazy" />',
    );
  });
});
