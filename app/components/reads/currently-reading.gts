import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import { modifier } from "ember-modifier";

import IconButton from "#components/icon-button.gts";
import BookCard from "#components/reads/book-card.gts";
import type { Book } from "#shared/api.ts";

import "./reads.css";

interface CurrentlyReadingSignature {
  Args: { books: Book[] };
}

/**
 * What I'm reading: nearly always one book, shown large. Should there ever be more,
 * they scroll sideways one at a time.
 */
export default class CurrentlyReading extends Component<CurrentlyReadingSignature> {
  #track?: HTMLElement;

  get isCarousel() {
    return this.args.books.length > 1;
  }

  registerTrack = modifier((element: HTMLElement) => {
    this.#track = element;
  });

  scroll = (direction: 1 | -1) => {
    const track = this.#track;

    if (!track) return;

    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  previous = () => this.scroll(-1);
  next = () => this.scroll(1);

  <template>
    {{#if this.isCarousel}}
      <div class="current-reads current-reads--carousel">
        <ul
          role="list"
          class="current-reads__track"
          aria-label="Books I'm reading"
          {{this.registerTrack}}
        >
          {{#each @books as |book|}}
            <li><BookCard @book={{book}} @featured={{true}} /></li>
          {{/each}}
        </ul>
        <div class="current-reads__controls">
          <IconButton @icon="chevronLeft" @label="Previous book" {{on "click" this.previous}} />
          <IconButton @icon="chevronRight" @label="Next book" {{on "click" this.next}} />
        </div>
      </div>
    {{else}}
      {{#each @books as |book|}}
        <BookCard @book={{book}} @featured={{true}} class="current-reads" />
      {{/each}}
    {{/if}}
  </template>
}
