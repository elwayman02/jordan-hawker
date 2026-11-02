import { XMLParser } from "fast-xml-parser";

import { USER_AGENT } from "./config.ts";

/** Query parameters that carry secrets (api_key, key, token…) */
const SECRET_PARAM = /key|token|secret|password/i;

/** The URL with secret query parameters hidden, for error messages (which end up in logs) */
export function redact(url: string): string {
  try {
    const parsed = new URL(url);
    const secrets = [...parsed.searchParams.keys()].filter((name) => SECRET_PARAM.test(name));

    if (!secrets.length) return url;

    for (const name of secrets) parsed.searchParams.set(name, "REDACTED");

    return parsed.toString();
  } catch {
    return url;
  }
}

export async function fetchText(url: string, init: RequestInit = {}): Promise<string> {
  const response = await fetch(url, {
    ...init,
    headers: { "user-agent": USER_AGENT, ...init.headers },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} from ${redact(url)}`);
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
