import { getStore } from "@netlify/blobs";

import type { ApiResponse } from "../shared/api.ts";

interface CacheOptions {
  /** seconds the CDN serves the response as fresh */
  maxAge: number;
  /** seconds the CDN may keep serving it while refreshing in the background */
  staleWhileRevalidate?: number;
}

export const HOUR = 60 * 60;
const DAY = 24 * HOUR;

function snapshots() {
  return getStore({ name: "api-snapshots", consistency: "strong" });
}

function json(body: unknown, status: number, cdnCache: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Browsers always revalidate; Netlify's CDN does the real caching.
      "cache-control": "public, max-age=0, must-revalidate",
      "netlify-cdn-cache-control": cdnCache,
    },
  });
}

/**
 * Produces an API response for `key`, with CDN caching and a last-known-good fallback.
 *
 * On success the result is snapshotted to Netlify Blobs.
 * When the upstream fails, the latest snapshot is served (marked `stale`)
 * with a short cache lifetime so a recovery is picked up quickly.
 */
export async function respond<T>(
  key: string,
  produce: () => Promise<T>,
  { maxAge, staleWhileRevalidate = DAY }: CacheOptions,
): Promise<Response> {
  try {
    const body: ApiResponse<T> = {
      data: await produce(),
      fetchedAt: new Date().toISOString(),
      stale: false,
    };

    try {
      await snapshots().setJSON(key, body);
    } catch (error) {
      console.warn(`[${key}] could not save snapshot`, error);
    }

    return json(
      body,
      200,
      `public, durable, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    );
  } catch (error) {
    console.error(`[${key}] upstream failed`, error);

    let snapshot: ApiResponse<T> | null = null;

    try {
      snapshot = (await snapshots().get(key, { type: "json" })) as ApiResponse<T> | null;
    } catch (blobError) {
      console.warn(`[${key}] could not read snapshot`, blobError);
    }

    if (snapshot) {
      return json({ ...snapshot, stale: true }, 200, "public, durable, s-maxage=300");
    }

    return json({ error: `${key} is unavailable` }, 502, "no-store");
  }
}
