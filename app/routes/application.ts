import Route from "@ember/routing/route";
import { service } from "@ember/service";
import { registerDestructor } from "@ember/destroyable";
import { getOwner } from "@ember/owner";
import { buildWaiter } from "@ember/test-waiters";

import { setupAnalytics } from "#utils/analytics.ts";

import type RouterService from "@ember/routing/router-service";
import type Transition from "@ember/routing/transition";

const waiter = buildWaiter("view-transition");

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Same-origin, same-tab, plain left-clicks on links to other pages of this site */
function internalPath(event: MouseEvent): string | undefined {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = (event.target as Element | null)?.closest?.("a");

  if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;

  const url = new URL(link.href, location.href);

  if (url.origin !== location.origin || url.hash || url.pathname.startsWith("/api/")) return;
  if (url.pathname === location.pathname && url.search === location.search) return;

  return url.pathname + url.search;
}

export default class ApplicationRoute extends Route {
  @service declare router: RouterService;

  constructor(...args: ConstructorParameters<typeof Route>) {
    super(...args);

    this.router.on("routeDidChange", this.didChange);

    const root = this.rootElement;

    root.addEventListener("click", this.animateLinkClick, { capture: true });
    registerDestructor(this, () =>
      root.removeEventListener("click", this.animateLinkClick, { capture: true }),
    );

    setupAnalytics();
  }

  get rootElement(): Element {
    const { rootElement } = getOwner(this) as unknown as { rootElement?: string | Element };

    if (rootElement instanceof Element) return rootElement;

    return (rootElement && document.querySelector(rootElement)) || document.body;
  }

  /**
   * Cross-fade between pages with the View Transitions API.
   *
   * The navigation starts inside the transition's update callback, so the browser
   * snapshots the old page before Ember renders the new one. Nothing is aborted,
   * so anything awaiting a transition is unaffected. Back/forward navigation isn't animated.
   */
  animateLinkClick = (event: Event) => {
    if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) return;

    const path = internalPath(event as MouseEvent);

    if (!path) return;

    event.preventDefault();
    event.stopPropagation();

    const token = waiter.beginAsync();
    const viewTransition = document.startViewTransition(async () => {
      try {
        await this.router.transitionTo(path);
      } catch {
        // superseded by another navigation; nothing to animate
      }
      // Don't wait for an animation frame here: the browser pauses rendering until
      // this callback finishes, so a frame never comes (Chrome gives up after ~4s).
    });

    // A newer navigation can skip this transition; that's expected, not an error.
    const ignore = () => {};

    viewTransition.ready.catch(ignore);
    viewTransition.updateCallbackDone.catch(ignore);
    void viewTransition.finished.catch(ignore).finally(() => waiter.endAsync(token));
  };

  #lastPath = location.pathname;

  /** New pages start at the top, including the same route with a new param (another guide or post) */
  didChange = (transition: Transition) => {
    const path = location.pathname;
    const newPage = path !== this.#lastPath;

    this.#lastPath = path;

    if (transition.from && newPage && !location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };
}
