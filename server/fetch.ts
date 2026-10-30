import { XMLParser } from "fast-xml-parser";

import { USER_AGENT } from "./config.ts";

export async function fetchText(url: string, init: RequestInit = {}): Promise<string> {
  const response = await fetch(url, {
    ...init,
    headers: { "user-agent": USER_AGENT, ...init.headers },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} from ${url}`);
  }

  return response.text();
}

export async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  return JSON.parse(await fetchText(url, init)) as T;
}

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  isArray: (name) => ["item", "entry", "category"].includes(name),
});

export function parseXml<T>(text: string): T {
  return xml.parse(text) as T;
}
