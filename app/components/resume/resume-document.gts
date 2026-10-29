import { htmlSafe } from "@ember/template";
import { modifier } from "ember-modifier";

import type { Resume, ResumeBlock } from "#shared/api.ts";
import type { TOC } from "@ember/component/template-only";

import "./resume-document.css";

/**
 * The structured view is built from sanitized HTML produced by /api/resume,
 * so it is safe to render as-is.
 */
const html = (value: string) => htmlSafe(value);

const listItems = (block: ResumeBlock) => (block.kind === "list" ? block.items : undefined);
const lineOf = (block: ResumeBlock) => (block.kind === "line" ? block : undefined);

/**
 * Overrides layered on top of Google's own stylesheet in the fallback view:
 * make it fluid, readable, and follow the site's theme.
 */
const FALLBACK_OVERRIDES = `
  :host { display: block; color: var(--text); }
  .doc-content { max-width: none !important; padding: 0 !important; background: none !important; }
  * { color: inherit !important; font-family: var(--font-body) !important; }
  a { color: var(--accent-strong) !important; }
  p, li { line-height: 1.5 !important; }
  .title span { font-family: var(--font-display) !important; }
`;

/** Renders the original document into a shadow root so its CSS can't leak out */
const shadowDocument = modifier((element: HTMLElement, [original]: [Resume["original"]]) => {
  const root = element.shadowRoot ?? element.attachShadow({ mode: "open" });

  root.innerHTML = `<style>${original.css}${FALLBACK_OVERRIDES}</style>${original.html}`;
});

interface ResumeDocumentSignature {
  Args: { resume: Resume };
}

const ResumeDocument: TOC<ResumeDocumentSignature> = <template>
  {{#if @resume.structured}}
    <article class="resume">
      <header class="resume__header">
        <h2 class="resume__name">{{@resume.name}}</h2>
        {{#each @resume.intro as |line|}}
          <p class="resume__intro">{{html line}}</p>
        {{/each}}
      </header>

      {{#each @resume.sections as |part|}}
        <section class="resume__section">
          <h3 class="resume__section-title">{{part.title}}</h3>

          {{#each part.blocks as |block|}}
            {{#let (listItems block) (lineOf block) as |items line|}}
              {{#if items}}
                <ul class="resume__list">
                  {{#each items as |item|}}
                    <li>{{html item}}</li>
                  {{/each}}
                </ul>
              {{else if line}}
                <div class="resume__line resume__line--{{line.level}}">
                  <span class="resume__left">{{html line.left}}</span>
                  {{#if line.right}}
                    <span class="resume__right">{{line.right}}</span>
                  {{/if}}
                </div>
              {{/if}}
            {{/let}}
          {{/each}}
        </section>
      {{/each}}
    </article>
  {{else}}
    <div class="resume resume--original" {{shadowDocument @resume.original}}></div>
  {{/if}}
</template>;

export default ResumeDocument;
