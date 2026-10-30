import type { Post, Words } from "../shared/api.ts";
import { env, TUMBLR_BLOG } from "./config.ts";
import { fetchJson } from "./fetch.ts";
import { excerpt, sanitizeArticle } from "./html.ts";

/**
 * Posts come from Tumblr today. Anything that can produce `Post[]` can replace it
 * (e.g. Markdown files in the repo) without touching the app.
 */
interface TumblrPost {
  id_string: string;
  type: string;
  title?: string;
  body?: string;
  summary?: string;
  post_url: string;
  timestamp: number;
  tags: string[];
}

interface TumblrResponse {
  response: { posts: TumblrPost[]; total_posts: number };
}

export function toPost(post: TumblrPost): Post {
  const body = sanitizeArticle(post.body ?? "");

  return {
    // v1 used the Tumblr post id as the slug (/p/:id), keep it so old links resolve
    slug: post.id_string,
    title: post.title || post.summary || "Untitled",
    publishedAt: new Date(post.timestamp * 1000).toISOString(),
    excerpt: excerpt(body),
    tags: post.tags,
    url: post.post_url,
    body,
  };
}

export async function getWords(): Promise<Words> {
  const key = env("TUMBLR_API_KEY");

  if (!key) throw new Error("TUMBLR_API_KEY is not set");

  const posts: Post[] = [];

  for (let offset = 0; offset < 200; offset += 20) {
    const { response } = await fetchJson<TumblrResponse>(
      `https://api.tumblr.com/v2/blog/${TUMBLR_BLOG}/posts/text?api_key=${key}&npf=false&limit=20&offset=${offset}`,
    );

    posts.push(...response.posts.map(toPost));

    if (posts.length >= response.total_posts || response.posts.length < 20) break;
  }

  return { posts };
}
