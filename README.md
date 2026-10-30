# jordanhawker.com

Personal website for Jordan Hawker: work, open source, music, and writing.

Every section has a five-letter path: [`/works`](https://www.jordanhawker.com/works), [`/codes`](https://www.jordanhawker.com/codes), [`/sound`](https://www.jordanhawker.com/sound), and [`/words`](https://www.jordanhawker.com/words).

## Stack

- [Ember 7](https://emberjs.com) with `.gts` components and Vite, generated with [ember.nvp](https://github.com/NullVoxPopuli/ember.nvp)
- TypeScript + Glint, ESLint, Prettier
- [Vitest](https://vitest.dev) (browser mode via [ember-vitest](https://github.com/NullVoxPopuli/ember-vitest), plus Node tests for the data layer)
- [Netlify](https://www.netlify.com): static hosting, [Functions](https://docs.netlify.com/functions/overview/) for live data, [Blobs](https://docs.netlify.com/blobs/overview/) for fallbacks
- Plain modern CSS (cascade layers, nesting, `light-dark()`, container queries, View Transitions)
- Icons from [Lucide](https://lucide.dev), [Remix Icon](https://remixicon.com), and [Simple Icons](https://simpleicons.org) via [unplugin-icons](https://github.com/unplugin/unplugin-icons)
- GitHub Actions CI, Renovate for dependency updates

## Development

Requires Node 24+ and pnpm.

```sh
pnpm install
pnpm dev          # app + Netlify Functions at http://localhost:5173
pnpm test         # browser + node tests
pnpm test:node    # data-layer tests only
pnpm lint         # eslint, prettier, glint
pnpm lint:fix
pnpm build
```

Local secrets go in a `.env` file (gitignored). See [environment variables](#environment-variables).

## How content stays fresh

Nothing on the site requires a rebuild or redeploy to update. External content is served through small Netlify Functions (`netlify/functions/*` → `server/*`). Netlify's CDN caches each response and refreshes it in the background when it expires (`stale-while-revalidate`), so a function runs at most about once per refresh interval, and only if someone visits. To pick up a change sooner, clear the cache from the Netlify UI or redeploy. If an upstream source is down, the function serves the last good response from Netlify Blobs.

| Content             | Source                                                            | Endpoint      | Refreshes |
| ------------------- | ----------------------------------------------------------------- | ------------- | --------- |
| Resume              | Published Google Doc ([jhawk.co/resume](https://jhawk.co/resume)) | `/api/resume` | ~3 hours  |
| Projects            | GitHub repos owned by `elwayman02`                                | `/api/codes`  | ~6 hours  |
| Tracks & videos     | SoundCloud RSS, YouTube music video playlist                      | `/api/sound`  | ~12 hours |
| Blog posts          | Tumblr API                                                        | `/api/words`  | ~12 hours |
| Hella Drunk reviews | helladrunk.com RSS                                                | `/api/hella`  | ~1 day    |
| Bluesky posts       | Bluesky public API, called from the browser                       | none          | live      |

### The resume

The Google Doc is the single source of truth. `/api/resume` parses the published doc into sections, organizations, roles, dates, and bullets, using the doc's own formatting:

- **Section headings**: bold ALL-CAPS paragraphs (e.g. `EXPERIENCE`)
- **Organization lines**: bold, 11pt or larger. **Role lines**: bold, under 11pt.
- **Right-hand column** (dates, locations): separated from the left by a tab or a run of spaces

If the doc's structure stops looking like a resume, the page falls back to rendering the original document (sanitized, inside a shadow root) rather than breaking.

### Hand-maintained content

- `app/data/recommendations.ts`: LinkedIn recommendations. LinkedIn has no API for these, so add new ones to the top of the list.
- `app/data/site.ts`: contact links, music links, Hella Drunk details
- `server/config.ts`: upstream URLs and IDs, plus `FEATURED_REPOS` and `HIDDEN_REPOS` to pin or hide projects on `/codes`

## Environment variables

Set these in Netlify (Site configuration → Environment variables) and in a local `.env` for development.

| Variable                          | Required | Purpose                                                                                            |
| --------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `TUMBLR_API_KEY`                  | yes      | Tumblr API key for `/words`                                                                        |
| `GITHUB_TOKEN`                    | no       | Raises GitHub's API rate limit (a fine-grained token with no scopes is enough)                     |
| `YOUTUBE_API_KEY`                 | no       | Reads the music video playlist on `/sound` (YouTube's no-key feed is usually unavailable)          |
| `VITE_CLOUDFLARE_ANALYTICS_TOKEN` | no       | Enables [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) (read at build time) |

## Deployment

Netlify builds every push. Pull requests get deploy previews, and merges to `master` go to production. Build settings live in `netlify.toml`, and v1 URLs are redirected in `public/_redirects`.
