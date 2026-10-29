import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";

import type { Remote } from "#utils/remote.ts";

interface AwaitSignature<T> {
  Args: {
    remote: Remote<T>;
    /** min-height of the default loading skeleton */
    skeletonHeight?: string;
  };
  Blocks: {
    default: [value: T, remote: Remote<T>];
    loading: [];
    error: [error: unknown];
  };
}

/**
 * Renders a Remote's value once loaded, with a skeleton while loading
 * and a quiet notice on failure (both overridable via named blocks).
 */
export default class Await<T> extends Component<AwaitSignature<T>> {
  get skeletonStyle() {
    return htmlSafe(`--skeleton-height: ${this.args.skeletonHeight ?? "8rem"}`);
  }

  <template>
    {{#if @remote.isLoading}}
      {{#if (has-block "loading")}}
        {{yield to="loading"}}
      {{else}}
        <div
          class="skeleton"
          style={{this.skeletonStyle}}
          aria-busy="true"
          aria-label="Loading"
        ></div>
      {{/if}}
    {{else if @remote.value}}
      {{yield @remote.value @remote}}
    {{else if (has-block "error")}}
      {{yield @remote.error to="error"}}
    {{else}}
      <p class="notice">This couldn’t be loaded right now. Please try again later.</p>
    {{/if}}
  </template>
}
