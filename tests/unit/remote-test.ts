import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { api, setFetcher } from "#utils/remote.ts";

const ok = (data: unknown) =>
  new Response(JSON.stringify({ data, fetchedAt: "2026-11-02T00:00:00Z", stale: false }));
const down = () => new Response(JSON.stringify({ error: "codes is unavailable" }), { status: 502 });

describe("api", () => {
  let responses: (() => Response)[];
  let calls: number;

  beforeEach(() => {
    calls = 0;
    responses = [];
    setFetcher(() => {
      calls += 1;

      return Promise.resolve((responses.shift() ?? down)());
    });
    // Remote logs failures; keep the test output quiet
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    setFetcher();
    vi.restoreAllMocks();
  });

  test("fetches each source once, then shares it", async () => {
    responses = [() => ok({ active: [], archive: [] })];

    const first = api("codes");

    await first.promise;

    expect(api("codes")).toBe(first);
    expect(first.value).toEqual({ active: [], archive: [] });
    expect(calls).toBe(1);
  });

  test("a failure isn't kept: whatever asks next tries again", async () => {
    responses = [down, () => ok({ active: [], archive: [] })];

    const failed = api("codes");

    await failed.promise;

    expect(failed.error).toBeInstanceOf(Error);

    const retried = api("codes");

    await retried.promise;

    expect(retried).not.toBe(failed);
    expect(retried.value).toEqual({ active: [], archive: [] });
    expect(calls).toBe(2);
  });
});
