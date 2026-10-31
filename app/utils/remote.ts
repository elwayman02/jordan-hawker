import { tracked } from "@glimmer/tracking";

import type { ApiResponse, Codes, Hella, Resume, Sound, Votes, Words } from "#shared/api.ts";

/**
 * Reactive wrapper around a one-shot async load.
 * Templates read `isLoading` / `value` / `error` and re-render as they change.
 */
export class Remote<T> {
  @tracked isLoading = true;
  @tracked value: T | undefined;
  @tracked error: unknown;
  /** true when the server served its last-known-good snapshot */
  @tracked stale = false;
  @tracked fetchedAt: Date | undefined;

  readonly promise: Promise<void>;

  constructor(load: () => Promise<{ value: T; stale?: boolean; fetchedAt?: string }>) {
    this.promise = load().then(
      ({ value, stale, fetchedAt }) => {
        this.value = value;
        this.stale = Boolean(stale);
        this.fetchedAt = fetchedAt ? new Date(fetchedAt) : undefined;
        this.isLoading = false;
      },
      (error: unknown) => {
        console.error(error);
        this.error = error;
        this.isLoading = false;
      },
    );
  }
}

export interface Endpoints {
  resume: Resume;
  codes: Codes;
  sound: Sound;
  words: Words;
  hella: Hella;
  votes: Votes;
}

type Fetcher = (url: string) => Promise<Response>;

let fetcher: Fetcher = (url) => fetch(url);
const cache = new Map<string, Remote<unknown>>();

/** For tests: swap the network layer and forget previous results */
export function setFetcher(next?: Fetcher) {
  fetcher = next ?? ((url) => fetch(url));
  cache.clear();
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetcher(url);

  if (!response.ok) throw new Error(`${response.status} from ${url}`);

  return (await response.json()) as T;
}

/**
 * Shared, cached remote state keyed by `key`.
 * Each source is fetched once per page load; Netlify's CDN keeps the data fresh.
 */
export function remote<T>(
  key: string,
  load: () => Promise<{ value: T; stale?: boolean; fetchedAt?: string }>,
): Remote<T> {
  let entry = cache.get(key) as Remote<T> | undefined;

  if (!entry) {
    entry = new Remote(load);
    cache.set(key, entry);
  }

  return entry;
}

/** Data from our own /api/* Netlify Functions */
export function api<K extends keyof Endpoints>(name: K): Remote<Endpoints[K]> {
  return remote(`api:${name}`, async () => {
    const body = await fetchJson<ApiResponse<Endpoints[K]>>(`/api/${name}`);

    return { value: body.data, stale: body.stale, fetchedAt: body.fetchedAt };
  });
}
