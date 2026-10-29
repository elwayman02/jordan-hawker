import type { Hella } from "../shared/api.ts";
import { HELLA_DRUNK_FEED } from "./config.ts";
import { fetchText, parseXml } from "./fetch.ts";
import { excerpt } from "./html.ts";

interface HellaFeed {
  rss: {
    channel: {
      item?: { title: string; link: string; pubDate: string; description?: string }[];
    };
  };
}

export function parseHella(xml: string, limit = 3): Hella {
  const items = parseXml<HellaFeed>(xml).rss.channel.item ?? [];

  const posts = items
    .map((item) => ({
      title: String(item.title),
      url: item.link,
      publishedAt: new Date(item.pubDate).toISOString(),
      excerpt: excerpt(item.description ?? "", 160),
    }))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, limit);

  return { posts };
}

export async function getHella(): Promise<Hella> {
  return parseHella(await fetchText(HELLA_DRUNK_FEED));
}
