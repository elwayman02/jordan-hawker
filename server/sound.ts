import type { Sound, Track, Video } from "../shared/api.ts";
import { env, SOUNDCLOUD_USER_ID, YOUTUBE_CHANNEL_ID } from "./config.ts";
import { fetchJson, fetchText, parseXml } from "./fetch.ts";

const LIMIT = 8;

interface SoundCloudFeed {
  rss: {
    channel: {
      item?: {
        guid: string | { "#text": string };
        title: string;
        link: string;
        pubDate: string;
        "itunes:duration"?: string;
        "itunes:image"?: { "@href": string };
        description?: string;
      }[];
    };
  };
}

export function parseSoundCloud(xml: string): Track[] {
  const items = parseXml<SoundCloudFeed>(xml).rss.channel.item ?? [];

  return items.slice(0, LIMIT).map((item) => {
    const guid = typeof item.guid === "string" ? item.guid : item.guid["#text"];

    return {
      // tag:soundcloud,2010:tracks/1323785659
      id: guid.split("/").at(-1)!,
      title: String(item.title),
      url: item.link,
      publishedAt: new Date(item.pubDate).toISOString(),
      duration: item["itunes:duration"]?.replace(/^00:/, ""),
      artwork: item["itunes:image"]?.["@href"],
      description: item.description?.trim(),
    };
  });
}

interface YouTubeFeed {
  feed: {
    entry?: {
      "yt:videoId": string;
      title: string;
      published: string;
    }[];
  };
}

export function parseYouTubeFeed(xml: string): Video[] {
  const entries = parseXml<YouTubeFeed>(xml).feed.entry ?? [];

  return entries
    .slice(0, LIMIT)
    .map((entry) => toVideo(entry["yt:videoId"], entry.title, entry.published));
}

function toVideo(id: string, title: string, publishedAt: string): Video {
  return {
    id,
    title: String(title),
    url: `https://www.youtube.com/watch?v=${id}`,
    publishedAt: new Date(publishedAt).toISOString(),
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

interface PlaylistItems {
  items: {
    snippet: { title: string; publishedAt: string; resourceId: { videoId: string } };
    contentDetails?: { videoPublishedAt?: string };
  }[];
}

/**
 * The channel RSS feed needs no key, but has been unreliable.
 * When YOUTUBE_API_KEY is set, the Data API (uploads playlist, 1 quota unit) is used as a fallback.
 */
async function getVideos(): Promise<Video[]> {
  try {
    return parseYouTubeFeed(
      await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`),
    );
  } catch (feedError) {
    const key = env("YOUTUBE_API_KEY");

    if (!key) throw feedError;

    const uploads = YOUTUBE_CHANNEL_ID.replace(/^UC/, "UU");
    const { items } = await fetchJson<PlaylistItems>(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=${LIMIT}&playlistId=${uploads}&key=${key}`,
    );

    return items.map(({ snippet, contentDetails }) =>
      toVideo(
        snippet.resourceId.videoId,
        snippet.title,
        contentDetails?.videoPublishedAt ?? snippet.publishedAt,
      ),
    );
  }
}

export async function getSound(): Promise<Sound> {
  const [tracks, videos] = await Promise.allSettled([
    fetchText(
      `https://feeds.soundcloud.com/users/soundcloud:users:${SOUNDCLOUD_USER_ID}/sounds.rss`,
    ).then(parseSoundCloud),
    getVideos(),
  ]);

  if (tracks.status === "rejected" && videos.status === "rejected") {
    throw new AggregateError([tracks.reason, videos.reason], "SoundCloud and YouTube both failed");
  }

  if (tracks.status === "rejected") console.warn("[sound] SoundCloud failed", tracks.reason);
  if (videos.status === "rejected") console.warn("[sound] YouTube failed", videos.reason);

  return {
    tracks: tracks.status === "fulfilled" ? tracks.value : [],
    videos: videos.status === "fulfilled" ? videos.value : [],
  };
}
