import { afterEach, describe, expect, test, vi } from "vitest";

import type { Book } from "../shared/api.ts";
import {
  buildReads,
  favorites,
  fetchShelf,
  parseProfile,
  parseShelf,
  splitSeries,
  upNext,
  widgetHtml,
} from "./reads.ts";

interface Entry {
  entry: string;
  /** with the series, as the cover link's title has it */
  title: string;
  /** the book id in the cover URL; omit for Goodreads' "no photo" placeholder */
  bookId?: string;
  author: [id: string, name: string];
  stars: number;
  review?: string;
}

/** A shelf in the shape of Goodreads' bookshelf widget: HTML inside a single-quoted JS string */
function widget(entries: Entry[], id = "jh1"): string {
  const star = (on: boolean) =>
    `<img style="width:15px;height:15px" alt="" src="https://s.gr-assets.com/images/layout/gr_flat_red_star_${on ? "active" : "inactive"}.png" />`;
  const books = entries
    .map(({ entry, title, bookId, author, stars, review }) => {
      const cover = bookId
        ? `https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1377536871l/${bookId}._SX50_.jpg`
        : "https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png";
      const link = `https://www.goodreads.com/review/show/${entry}?utm_medium=api&amp;utm_source=custom_widget`;

      return `
      <div class="gr_custom_each_container_${id}">
          <div class="gr_custom_book_container_${id}">
            <a title="${title}" rel="nofollow" href="${link}"><img alt="${title}" border="0" src="${cover}" /></a>
          </div>
          <div class="gr_custom_rating_${id}">
            <span class=" staticStars notranslate" title="ok">${[1, 2, 3, 4, 5].map((n) => star(n <= stars)).join("")}</span>
          </div>
          <div class="gr_custom_title_${id}">
            <a rel="nofollow" href="${link}">${title.replace(/ \(.*\)$/, "")}</a>
          </div>
          <div class="gr_custom_author_${id}">
            by <a rel="nofollow" href="https://www.goodreads.com/author/show/${author[0]}.X">${author[1]}</a>
          </div>
          ${review === undefined ? "" : `<div class="gr_custom_review_${id}">\n            ${review}\n          </div>`}
      </div>`;
    })
    .join("");
  const html = `  <div class="gr_custom_container_${id}">${books}\n  </div>\n`;
  // escaped the way Goodreads does: \" \/ \n and \'
  const escaped = html
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\//g, "\\/")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n");

  return `  var widget_code = '${escaped}'\n  var widget_div = document.getElementById('gr_custom_widget_${id}')\n  if (widget_div) {\n    widget_div.innerHTML = widget_code\n  }\n`;
}

const book = (overrides: Partial<Book> & Pick<Book, "id">): Book => ({
  url: `https://www.goodreads.com/book/show/${overrides.id}`,
  title: overrides.id,
  author: { id: "1", name: "Author One" },
  rating: 4,
  ...overrides,
});

describe("splitSeries", () => {
  test.each([
    ["All Hail Chaos (Time of Iron, #2)", "All Hail Chaos", { name: "Time of Iron", number: "2" }],
    ["The Churn (The Expanse, #3.5)", "The Churn", { name: "The Expanse", number: "3.5" }],
    ["Omnibus (Saga #1-3)", "Omnibus", { name: "Saga", number: "1-3" }],
    ["Project Hail Mary", "Project Hail Mary", undefined],
    ["Kitchen Confidential (Updated Edition)", "Kitchen Confidential (Updated Edition)", undefined],
  ])("%s", (full, title, series) => {
    expect(splitSeries(full)).toEqual(series ? { title, series } : { title });
  });
});

describe("parseShelf", () => {
  const books = parseShelf(
    widget([
      {
        entry: "101",
        title: "A Reaper at the Gates (An Ember in the Ashes, #3)",
        bookId: "213075365",
        author: ["7", "Sabaa Tahir"],
        stars: 4,
      },
      {
        entry: "102",
        title: "Fate&#39;s Bane",
        author: ["9", "C.L. Clark"],
        stars: 0,
        review: "It&#39;s good, but I wanted more...",
      },
    ]),
  );

  test("reads each book, with its series split from the title", () => {
    expect(books[0]).toEqual({
      id: "101",
      url: "https://www.goodreads.com/book/show/213075365",
      title: "A Reaper at the Gates",
      series: { name: "An Ember in the Ashes", number: "3" },
      author: { id: "7", name: "Sabaa Tahir" },
      cover:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1377536871l/213075365._SY300_.jpg",
      rating: 4,
    });
  });

  test("handles a missing cover, entities, escaped quotes and a review excerpt", () => {
    expect(books[1]).toEqual({
      id: "102",
      // no book id without a cover, so it links to the shelf entry
      url: "https://www.goodreads.com/review/show/102",
      title: "Fate's Bane",
      author: { id: "9", name: "C.L. Clark" },
      cover: undefined,
      rating: 0,
      review: "It's good, but I wanted more…",
    });
  });

  test("rejects anything that isn't the widget", () => {
    expect(() => widgetHtml("<html>Page not found</html>")).toThrow("Unrecognized");
  });
});

describe("fetchShelf", () => {
  afterEach(() => vi.unstubAllGlobals());

  const entry = (id: string): Entry => ({
    entry: id,
    title: `Book ${id}`,
    bookId: id,
    author: ["1", "A"],
    stars: 5,
  });

  /** Serves a shelf per sort order (`sort` and `order` query parameters) */
  function serve(shelves: Record<string, Entry[] | "fail">) {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const params = new URL(url).searchParams;
        const shelf = shelves[`${params.get("sort")}:${params.get("order")}`];

        return Promise.resolve(
          shelf === "fail" || !shelf
            ? new Response("Page not found", { status: 404 })
            : new Response(widget(shelf), { status: 200 }),
        );
      }),
    );
  }

  test("merges several orders past the 100-book limit, keeping the first order's", async () => {
    serve({
      "date_read:d": [entry("3"), entry("2")],
      "date_read:a": [entry("1"), entry("2")],
      "title:a": "fail",
    });

    const books = await fetchShelf("read", [
      ["date_read", "d"],
      ["date_read", "a"],
      ["title", "a"],
    ]);

    expect(books.map((b) => b.id)).toEqual(["3", "2", "1"]);
  });

  test("fails when the first order fails, so the last good snapshot is served", async () => {
    serve({ "date_read:d": "fail", "date_read:a": [entry("1")] });

    await expect(
      fetchShelf("read", [
        ["date_read", "d"],
        ["date_read", "a"],
      ]),
    ).rejects.toThrow("404");
  });

  test("gives each shelf and order its own widget id, new each day", async () => {
    serve({ "date_read:d": [entry("1")] });

    await fetchShelf("read", [["date_read", "d"]], "20261102");

    const url = new URL(vi.mocked(fetch).mock.calls[0]![0] as string);

    expect(url.pathname).toBe("/review/custom_widget/21718161");
    expect(url.searchParams.get("widget_id")).toBe("jhreaddate_readd20261102");
  });
});

describe("parseProfile", () => {
  const html = `
    <a href="/review/list/21718161-jordan-hawker?shelf=read">read&lrm; (337)</a>
    <a href="/review/list/21718161-jordan-hawker?shelf=to-read">to-read&lrm; (1,117)</a>
    <div>333 ratings <a href="#">(4.37 avg)</a></div>
    <a href="/genres/art">Art</a>
    <h2>Favorite Genres</h2><div class="bigBoxContent">
      <a href="/genres/fantasy">Fantasy</a>, and <a href="/genres/science-fiction">Science fiction</a>
    </div><div class="bigBoxBottom"></div>`;

  test("reads shelf counts, rating totals and favorite genres", () => {
    expect(parseProfile(html)).toEqual({
      shelves: { read: 337, "to-read": 1117 },
      ratings: 333,
      averageRating: 4.37,
      genres: ["Fantasy", "Science fiction"],
    });
  });
});

describe("page data", () => {
  const butcher = { id: "10", name: "Jim Butcher" };
  const read = [
    book({ id: "d1", series: { name: "Dresden", number: "1" }, author: butcher, rating: 5 }),
    book({ id: "d2", series: { name: "Dresden", number: "2" }, author: butcher, rating: 5 }),
    book({ id: "solo", author: { id: "20", name: "Andy Weir" }, rating: 5 }),
    book({ id: "meh", author: { id: "30", name: "Someone" }, rating: 3 }),
  ];
  const owned = [
    book({ id: "d3", series: { name: "Dresden", number: "3" }, author: butcher }),
    book({ id: "weir2", author: { id: "20", name: "Andy Weir" } }),
    book({ id: "new", author: { id: "99", name: "New Author" } }),
  ];

  test("favorites: five stars, one per series or author", () => {
    expect(favorites(read).map((b) => b.id)).toEqual(["d1", "solo"]);
  });

  test("up next: owned books that continue a series, or else an author, I've read", () => {
    expect(upNext(read, owned)).toEqual([
      { kind: "series", key: "Dresden", name: "Dresden", read: 2, owned: [owned[0]] },
      { kind: "author", key: "20", name: "Andy Weir", read: 1, owned: [owned[1]] },
    ]);
  });

  test("most read: authors and series read more than once, marked with what I own", () => {
    const reads = buildReads({ current: [], read, owned }, undefined);

    expect(reads.mostRead.authors).toEqual([
      { kind: "author", key: "10", name: "Jim Butcher", read: 2, owned: [owned[0]] },
    ]);
    expect(reads.mostRead.series).toEqual([
      { kind: "series", key: "Dresden", name: "Dresden", read: 2, owned: [owned[0]] },
    ]);
  });

  test("stats come from the profile, or are worked out from the shelf without it", () => {
    expect(buildReads({ current: [], read, owned }, undefined).stats).toEqual({
      read: 4,
      ratings: 4,
      averageRating: 4.5,
      genres: [],
    });
    expect(
      buildReads(
        { current: [], read, owned },
        { shelves: { read: 337 }, ratings: 333, averageRating: 4.37, genres: ["Fantasy"] },
      ).stats,
    ).toEqual({ read: 337, ratings: 333, averageRating: 4.37, genres: ["Fantasy"] });
  });
});
