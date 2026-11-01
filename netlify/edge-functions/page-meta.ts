import { withMeta } from "../../server/meta.ts";

/**
 * Link previews (Discord, Slack, Bluesky…) read a page's HTML without running the app, and
 * every page is the same index.html. This writes each page's own title, description and
 * address into it as it's served. See server/meta.ts.
 */
export default async (request: Request, context: { next(): Promise<Response> }) => {
  const response = await context.next();

  if (!response.headers.get("content-type")?.includes("text/html")) return response;

  const headers = new Headers(response.headers);

  // the body changes length
  headers.delete("content-length");

  return new Response(withMeta(await response.text(), new URL(request.url)), {
    status: response.status,
    headers,
  });
};

// Pages only: the API, built assets and other files pass straight through
export const config = {
  path: "/*",
  excludedPath: ["/api/*", "/assets/*", "/og/*", "/*.svg", "/*.js", "/*.txt"],
};
