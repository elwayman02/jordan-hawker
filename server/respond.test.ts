import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import type { ApiResponse } from "../shared/api.ts";

/** Netlify Blobs, in memory */
const store = new Map<string, unknown>();
const blobs = {
  setJSON: vi.fn((key: string, value: unknown) => {
    store.set(key, value);

    return Promise.resolve();
  }),
  get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
};

vi.mock("@netlify/blobs", () => ({ getStore: () => blobs }));

const { HOUR, respond } = await import("./respond.ts");

const cdnCache = (response: Response) => response.headers.get("netlify-cdn-cache-control");

describe("respond", () => {
  beforeEach(() => {
    store.clear();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("serves fresh data with CDN caching, and saves it as the last good snapshot", async () => {
    const response = await respond("codes", () => Promise.resolve({ repos: 3 }), {
      maxAge: 6 * HOUR,
    });
    const body = (await response.json()) as ApiResponse<{ repos: number }>;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ data: { repos: 3 }, stale: false });
    expect(cdnCache(response)).toBe(
      "public, durable, s-maxage=21600, stale-while-revalidate=86400",
    );
    expect(response.headers.get("cache-control")).toBe("public, max-age=0, must-revalidate");
    expect(store.get("codes")).toEqual(body);
  });

  test("when the upstream fails, serves the last good snapshot, marked stale, briefly cached", async () => {
    await respond("codes", () => Promise.resolve({ repos: 3 }), { maxAge: HOUR });

    const response = await respond("codes", () => Promise.reject(new Error("GitHub is down")), {
      maxAge: HOUR,
    });
    const body = (await response.json()) as ApiResponse<{ repos: number }>;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ data: { repos: 3 }, stale: true });
    expect(cdnCache(response)).toBe("public, durable, s-maxage=300");
  });

  test("with no snapshot to fall back on, it's a 502 that isn't cached", async () => {
    const response = await respond("codes", () => Promise.reject(new Error("GitHub is down")), {
      maxAge: HOUR,
    });

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "codes is unavailable" });
    expect(cdnCache(response)).toBe("no-store");
  });

  test("Blobs being unavailable doesn't stop fresh data being served", async () => {
    blobs.setJSON.mockRejectedValueOnce(new Error("Blobs unavailable"));

    const response = await respond("codes", () => Promise.resolve({ repos: 3 }), { maxAge: HOUR });

    expect(response.status).toBe(200);
    expect(store.has("codes")).toBe(false);
  });

  test("Blobs being unavailable during an outage is still a clean 502", async () => {
    blobs.get.mockRejectedValueOnce(new Error("Blobs unavailable"));

    const response = await respond("codes", () => Promise.reject(new Error("GitHub is down")), {
      maxAge: HOUR,
    });

    expect(response.status).toBe(502);
  });
});
