import { parse, type HTMLElement } from "node-html-parser";

import type { Book, Reads, ReadsGroup } from "../shared/api.ts";
import { GOODREADS_USER_ID } from "./config.ts";
import { fetchText } from "./fetch.ts";

const GOODREADS = "https://www.goodreads.com";

/** The widget returns at most this many books per request */
const PER_REQUEST = 100;

const RECENT = 24;
const FAVORITES = 12;
const MOST_READ = 8;
const UP_NEXT = 8;

/* ------------------------------- the widget ------------------------------- */

/**
 * Goodreads' bookshelf widget is a script that assigns the shelf's HTML to `widget_code`,
 * as a single-quoted JavaScript string.
 */
export function widgetHtml(script: string): string {
  const code = /var widget_code = '([\s\S]*?)'\s*var widget_div/.exec(script)?.[1];

  if (code === undefined) throw new Error("Unrecognized Goodreads widget");

  return code.replace(/\\u([0-9a-f]{4})|\\(.)/gi, (_, hex: string | undefined, char: string) =>
    hex ? String.fromCharCode(parseInt(hex, 16)) : char === "n" ? "\n" : char,
  );
}

/** The widget's parts are divs classed gr_custom_<part>_<widget id> */
const part = (element: HTMLElement, name: string) =>
  element
    .querySelectorAll("div")
    .find((div) => div.getAttribute("class")?.startsWith(`gr_custom_${name}_`));

const clean = (text: string) => text.replace(/\s+/g, " ").trim();

/** "All Hail Chaos (Time of Iron, #2)" → title and series */
export function splitSeries(full: string): Pick<Book, "title" | "series"> {
  const match = /^(.*\S)\s*\(([^()]+?),?\s+#([\d.]+(?:-[\d.]+)?)\)$/.exec(full);

  if (!match) return { title: full };

  return { title: match[1]!, series: { name: match[2]!.trim(), number: match[3] } };
}

function toBook(item: HTMLElement): Book | undefined {
  const link = part(item, "title")?.querySelector("a");
  const entry = /review\/show\/(\d+)/.exec(link?.getAttribute("href") ?? "")?.[1];

  if (!link || !entry) return undefined;

  const coverLink = part(item, "book_container")?.querySelector("a");
  const src = coverLink?.querySelector("img")?.getAttribute("src") ?? "";
  // the cover link's title has the series ("A Reaper at the Gates (An Ember in the Ashes, #3)");
  // the title link's text doesn't
  const fullTitle = clean(coverLink?.getAttribute("title") ?? link.text);
  // https://i.gr-assets.com/…/books/1377536871l/18310206._SX50_.jpg; "nophoto" when there's no cover
  const bookId = src.includes("nophoto") ? undefined : /\/(\d+)\.(?:_[^./]+_\.)?jpg/.exec(src)?.[1];
  const authorLink = part(item, "author")?.querySelector("a");
  const review = clean(part(item, "review")?.text ?? "").replace(/\s*\.\.\.$/, "…");

  return {
    id: entry,
    url: bookId ? `${GOODREADS}/book/show/${bookId}` : `${GOODREADS}/review/show/${entry}`,
    ...splitSeries(fullTitle),
    author: {
      id: /author\/show\/(\d+)/.exec(authorLink?.getAttribute("href") ?? "")?.[1] ?? "",
      name: clean(authorLink?.text ?? ""),
    },
    // 50×75 thumbnails by default; the same image at 200×300
    cover: bookId ? src.replace(/\._S[XY]\d+_\./, "._SY300_.") : undefined,
    rating: (part(item, "rating")?.querySelectorAll("img") ?? []).filter((star) =>
      star.getAttribute("src")?.includes("star_active"),
    ).length,
    ...(review && { review }),
  };
}

/** The books in one widget response, in the order it lists them */
export function parseShelf(script: string): Book[] {
  return parse(widgetHtml(script))
    .querySelectorAll("div")
    .filter((div) => div.getAttribute("class")?.startsWith("gr_custom_each_container_"))
    .flatMap((item) => toBook(item) ?? []);
}

type Sort = "date_read" | "date_added" | "title" | "author" | "rating";
type Order = "a" | "d";

function widgetUrl(shelf: string, sort: Sort, order: Order, day: string): string {
  const params = new URLSearchParams({
    shelf,
    sort,
    order,
    num_books: String(PER_REQUEST),
    show_author: "1",
    show_cover: "1",
    show_rating: "1",
    show_review: "1",
    show_title: "1",
    // Goodreads caches each widget by id regardless of its settings, so every shelf and sort
    // gets its own id, and a new one daily so the cache can't go stale
    widget_id: `jh${shelf.replace(/\W/g, "")}${sort.replace(/\W/g, "")}${order}${day}`,
  });

  return `${GOODREADS}/review/custom_widget/${GOODREADS_USER_ID}?${params}`;
}

/**
 * A whole shelf, past the widget's 100-book limit: the same shelf in several orders, merged.
 * The first order decides the result's order; books found only by later ones follow it.
 */
export async function fetchShelf(
  shelf: string,
  orders: [Sort, Order][],
  day = new Date().toISOString().slice(0, 10).replace(/-/g, ""),
): Promise<Book[]> {
  const results = await Promise.allSettled(
    orders.map(async ([sort, order]) =>
      parseShelf(await fetchText(widgetUrl(shelf, sort, order, day))),
    ),
  );

  const [first] = results;

  // the primary order is what the page shows first; without it, keep the last good snapshot
  if (first?.status === "rejected") throw first.reason;

  const books = new Map<string, Book>();

  for (const result of results) {
    if (result.status === "rejected") {
      console.warn(`[reads] part of ${shelf} failed`, result.reason);
      continue;
    }

    for (const book of result.value) if (!books.has(book.id)) books.set(book.id, book);
  }

  return [...books.values()];
}

/* ----------------------------- the profile page ----------------------------- */

export interface Profile {
  /** shelf name → number of books */
  shelves: Record<string, number>;
  ratings?: number;
  averageRating?: number;
  genres: string[];
}

const toNumber = (text: string | undefined) =>
  text === undefined ? undefined : Number(text.replace(/,/g, ""));

/** Shelf counts, rating totals and favorite genres from the public profile page */
export function parseProfile(html: string): Profile {
  const shelves: Record<string, number> = {};

  for (const [, name, count] of html.matchAll(
    /shelf=([a-z0-9-]+)[^"]*"[^>]*>[^<(]*\((\d[\d,]*)\)/g,
  )) {
    shelves[name!] ??= toNumber(count)!;
  }

  const genreBox = /Favorite Genres([\s\S]*?)bigBoxBottom/.exec(html)?.[1] ?? "";

  return {
    shelves,
    ratings: toNumber(/([\d,]+) ratings/.exec(html)?.[1]),
    averageRating: toNumber(/\(([\d.]+) avg\)/.exec(html)?.[1]),
    genres: [...genreBox.matchAll(/href="\/genres\/[^"]+">([^<]+)</g)].map(([, genre]) =>
      clean(genre!),
    ),
  };
}

/* ------------------------------- the page data ------------------------------- */

type Key = (book: Book) => string | undefined;

const bySeries: Key = (book) => book.series?.name;
const byAuthor: Key = (book) => book.author.id || book.author.name || undefined;

function countBy(books: Book[], key: Key): Map<string, Book[]> {
  const groups = new Map<string, Book[]>();

  for (const book of books) {
    const name = key(book);

    if (name) groups.set(name, [...(groups.get(name) ?? []), book]);
  }

  return groups;
}

function topGroups(read: Book[], owned: Book[], kind: ReadsGroup["kind"]): ReadsGroup[] {
  const key = kind === "series" ? bySeries : byAuthor;
  const ownedBy = countBy(owned, key);

  return [...countBy(read, key)]
    .filter(([, books]) => books.length > 1)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, MOST_READ)
    .map(([groupKey, books]) => ({
      kind,
      key: groupKey,
      name: kind === "series" ? groupKey : books[0]!.author.name,
      read: books.length,
      owned: ownedBy.get(groupKey) ?? [],
    }));
}

/**
 * Owned books that continue something I've started: a series I've read part of, or else an
 * author I've read. Each owned book appears once, under its series when it has one.
 */
export function upNext(read: Book[], owned: Book[]): ReadsGroup[] {
  const readSeries = countBy(read, bySeries);
  const readAuthors = countBy(read, byAuthor);
  const groups = new Map<string, ReadsGroup>();

  for (const book of owned) {
    const series = bySeries(book);
    const author = byAuthor(book);
    const [kind, key, readBooks] =
      series && readSeries.has(series)
        ? (["series", series, readSeries.get(series)!] as const)
        : author && readAuthors.has(author)
          ? (["author", author, readAuthors.get(author)!] as const)
          : [];

    if (!kind) continue;

    const id = `${kind}:${key}`;
    const group = groups.get(id) ?? {
      kind,
      key,
      name: kind === "series" ? key : book.author.name,
      read: readBooks.length,
      owned: [],
    };

    group.owned.push(book);
    groups.set(id, group);
  }

  return [...groups.values()].sort((a, b) => b.read - a.read).slice(0, UP_NEXT);
}

/** Five-star reads, most recent first, one per series (or author, for standalones) */
export function favorites(read: Book[]): Book[] {
  const seen = new Set<string>();

  return read
    .filter((book) => book.rating === 5)
    .filter((book) => {
      const key = book.series ? `series:${book.series.name}` : `author:${byAuthor(book)}`;

      if (seen.has(key)) return false;
      seen.add(key);

      return true;
    })
    .slice(0, FAVORITES);
}

export function buildReads(
  { current, read, owned }: { current: Book[]; read: Book[]; owned: Book[] },
  profile: Profile | undefined,
): Reads {
  const rated = read.filter((book) => book.rating > 0);
  const average = rated.reduce((sum, book) => sum + book.rating, 0) / (rated.length || 1);

  return {
    current,
    recent: read.slice(0, RECENT),
    favorites: favorites(read),
    mostRead: {
      authors: topGroups(read, owned, "author"),
      series: topGroups(read, owned, "series"),
    },
    upNext: upNext(read, owned),
    stats: {
      read: profile?.shelves.read ?? read.length,
      ratings: profile?.ratings ?? rated.length,
      averageRating: profile?.averageRating ?? Math.round(average * 100) / 100,
      genres: profile?.genres ?? [],
    },
  };
}

/** Every way the widget sorts, both ways: together they reach past its 100-book limit */
const ALL_ORDERS: [Sort, Order][] = (
  ["date_read", "date_added", "title", "author", "rating"] as const
).flatMap((sort) => [
  [sort, "d"],
  [sort, "a"],
]);

export async function getReads(): Promise<Reads> {
  const [current, read, owned, profile] = await Promise.allSettled([
    fetchShelf("currently-reading", [["date_added", "d"]]),
    // most recently read first
    fetchShelf("read", ALL_ORDERS),
    fetchShelf("owned-unread", [
      ["date_added", "d"],
      ["date_added", "a"],
    ]),
    fetchText(`${GOODREADS}/user/show/${GOODREADS_USER_ID}`).then(parseProfile),
  ]);

  if (read.status === "rejected") throw read.reason;

  for (const [name, result] of Object.entries({ current, owned, profile })) {
    if (result.status === "rejected") console.warn(`[reads] ${name} failed`, result.reason);
  }

  return buildReads(
    {
      current: current.status === "fulfilled" ? current.value : [],
      read: read.value,
      owned: owned.status === "fulfilled" ? owned.value : [],
    },
    profile.status === "fulfilled" ? profile.value : undefined,
  );
}
