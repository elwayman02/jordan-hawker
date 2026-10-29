import { fetchJson, remote, type Remote } from "#utils/remote.ts";

/**
 * Bluesky's public AppView needs no auth and allows cross-origin requests,
 * so posts are read straight from the browser and are always live.
 */
const API = "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed";

export interface TextPart {
  text: string;
  href?: string;
}

export interface BlueskyImage {
  thumb: string;
  fullsize: string;
  alt: string;
}

export interface BlueskyPost {
  url: string;
  createdAt: string;
  parts: TextPart[];
  images: BlueskyImage[];
  external?: { url: string; title: string; description: string; thumb?: string; host: string };
  quote?: { author: string; handle: string; text: string; url: string };
  likes: number;
  reposts: number;
  replies: number;
}

/* --- minimal slices of the app.bsky lexicons we use --- */

interface Facet {
  index: { byteStart: number; byteEnd: number };
  features: { $type: string; uri?: string; did?: string; tag?: string }[];
}

interface Embed {
  $type: string;
  images?: { thumb: string; fullsize: string; alt: string }[];
  external?: { uri: string; title: string; description: string; thumb?: string };
  record?: {
    uri?: string;
    author?: { handle: string; displayName?: string };
    value?: { text?: string };
    record?: Embed["record"];
  };
  media?: Embed;
}

interface FeedItem {
  reason?: unknown;
  post: {
    uri: string;
    author: { handle: string };
    record: { text: string; createdAt: string; facets?: Facet[] };
    embed?: Embed;
    likeCount?: number;
    repostCount?: number;
    replyCount?: number;
  };
}

function postUrl(uri: string, handle: string): string {
  return `https://bsky.app/profile/${handle}/post/${uri.split("/").at(-1)}`;
}

/** Facets index into the UTF-8 bytes of the text, not JS string offsets */
export function splitFacets(text: string, facets: Facet[] = []): TextPart[] {
  const bytes = new TextEncoder().encode(text);
  const decoder = new TextDecoder();
  const parts: TextPart[] = [];
  let cursor = 0;

  const sorted = [...facets].sort((a, b) => a.index.byteStart - b.index.byteStart);

  for (const facet of sorted) {
    const { byteStart, byteEnd } = facet.index;

    if (byteStart < cursor || byteEnd > bytes.length) continue;

    const feature = facet.features[0];
    let href: string | undefined;

    if (feature?.$type === "app.bsky.richtext.facet#link") href = feature.uri;
    if (feature?.$type === "app.bsky.richtext.facet#mention") {
      href = `https://bsky.app/profile/${feature.did}`;
    }
    if (feature?.$type === "app.bsky.richtext.facet#tag") {
      href = `https://bsky.app/hashtag/${encodeURIComponent(feature.tag ?? "")}`;
    }

    if (byteStart > cursor) parts.push({ text: decoder.decode(bytes.slice(cursor, byteStart)) });

    parts.push({ text: decoder.decode(bytes.slice(byteStart, byteEnd)), href });
    cursor = byteEnd;
  }

  if (cursor < bytes.length) parts.push({ text: decoder.decode(bytes.slice(cursor)) });

  return parts;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function toPost(item: FeedItem): BlueskyPost {
  const { post } = item;
  const embed = post.embed;
  const media = embed?.$type === "app.bsky.embed.recordWithMedia#view" ? embed.media : embed;
  const quoted =
    embed?.$type === "app.bsky.embed.record#view"
      ? embed.record
      : embed?.$type === "app.bsky.embed.recordWithMedia#view"
        ? embed.record?.record
        : undefined;

  return {
    url: postUrl(post.uri, post.author.handle),
    createdAt: post.record.createdAt,
    parts: splitFacets(post.record.text, post.record.facets),
    images: media?.images?.map(({ thumb, fullsize, alt }) => ({ thumb, fullsize, alt })) ?? [],
    external: media?.external
      ? {
          url: media.external.uri,
          title: media.external.title,
          description: media.external.description,
          thumb: media.external.thumb,
          host: hostOf(media.external.uri),
        }
      : undefined,
    quote:
      quoted?.author && quoted.uri
        ? {
            author: quoted.author.displayName || quoted.author.handle,
            handle: quoted.author.handle,
            text: quoted.value?.text ?? "",
            url: postUrl(quoted.uri, quoted.author.handle),
          }
        : undefined,
    likes: post.likeCount ?? 0,
    reposts: post.repostCount ?? 0,
    replies: post.replyCount ?? 0,
  };
}

/** Original posts only: no replies, no reposts */
export function blueskyPosts(handle: string, limit = 6): Remote<BlueskyPost[]> {
  return remote(`bluesky:${handle}:${limit}`, async () => {
    const { feed } = await fetchJson<{ feed: FeedItem[] }>(
      `${API}?actor=${encodeURIComponent(handle)}&filter=posts_no_replies&limit=30`,
    );

    return {
      value: feed
        .filter((item) => !item.reason)
        .slice(0, limit)
        .map(toPost),
    };
  });
}
