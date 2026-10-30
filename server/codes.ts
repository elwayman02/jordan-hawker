import type { Codes, Repo } from "../shared/api.ts";
import { env, FEATURED_REPOS, GITHUB_USER, HIDDEN_REPOS } from "./config.ts";
import { fetchJson } from "./fetch.ts";

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

const MONTH = 1000 * 60 * 60 * 24 * 30.44;

/** A repo pushed within this window stays "active" regardless of stars */
const ACTIVE_WINDOW_MONTHS = 36;
/** ...and a repo with at least this many stars stays active for longer */
const ACTIVE_STARS = 25;
/** Untouched this long, a repo is archived however many stars it has (unless featured) */
const ARCHIVE_AFTER_MONTHS = 8 * 12;

/**
 * Popularity grows logarithmically (100 stars isn't 10x as interesting as 10),
 * and recency decays with a one-year half-life.
 */
export function score(stars: number, pushedAt: string, now = Date.now()): number {
  const ageInMonths = Math.max(0, (now - Date.parse(pushedAt)) / MONTH);
  const recency = 0.5 ** (ageInMonths / 12);

  return Math.round((Math.log2(stars + 1) + recency * 4) * 100) / 100;
}

export function rank(repos: GitHubRepo[], now = Date.now()): Codes {
  const active: Repo[] = [];
  const archive: Repo[] = [];

  for (const repo of repos) {
    if (repo.fork || repo.archived || repo.disabled || repo.private) continue;
    if (HIDDEN_REPOS.includes(repo.name)) continue;

    const entry: Repo = {
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language,
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      pushedAt: repo.pushed_at,
      createdAt: repo.created_at,
      score: score(repo.stargazers_count, repo.pushed_at, now),
      featured: FEATURED_REPOS.includes(repo.name),
    };

    const ageInMonths = (now - Date.parse(repo.pushed_at)) / MONTH;
    const isActive =
      entry.featured ||
      (ageInMonths < ARCHIVE_AFTER_MONTHS &&
        (ageInMonths <= ACTIVE_WINDOW_MONTHS || entry.stars >= ACTIVE_STARS));

    (isActive ? active : archive).push(entry);
  }

  active.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.featured) return FEATURED_REPOS.indexOf(a.name) - FEATURED_REPOS.indexOf(b.name);

    return b.score - a.score;
  });
  archive.sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt));

  return { active, archive };
}

export async function getCodes(): Promise<Codes> {
  const token = env("GITHUB_TOKEN");
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
  };

  if (token) headers.authorization = `Bearer ${token}`;

  const repos: GitHubRepo[] = [];

  for (let page = 1; page <= 5; page++) {
    const batch = await fetchJson<GitHubRepo[]>(
      `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=100&page=${page}`,
      { headers },
    );

    repos.push(...batch);

    if (batch.length < 100) break;
  }

  return rank(repos);
}
