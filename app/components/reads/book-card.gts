import { htmlSafe } from "@ember/template";

import Icon from "#components/icon.gts";
import type { Book } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./reads.css";

interface BookCardSignature {
  Args: {
    book: Book;
    /** a bigger cover, with the details beside it */
    featured?: boolean;
  };
  Element: HTMLElement;
}

const STARS = [1, 2, 3, 4, 5];

const filled = (star: number, rating: number) => star <= rating;

const seriesLabel = (book: Book) =>
  book.series
    ? `${book.series.name}${book.series.number ? ` #${book.series.number}` : ""}`
    : undefined;

/** Covers are 2:3; the reserved space stops the grid jumping as they load */
const coverStyle = htmlSafe("aspect-ratio: 2 / 3");

/** A book from my Goodreads shelves, linking to its page on Goodreads */
const BookCard: TOC<BookCardSignature> = <template>
  <article class="book {{if @featured 'book--featured'}}" ...attributes>
    {{! the title is the link; the cover repeats it for pointers only }}
    <a
      href={{@book.url}}
      target="_blank"
      rel="noopener noreferrer"
      class="book__cover"
      tabindex="-1"
      aria-hidden="true"
    >
      {{#if @book.cover}}
        <img
          src={{@book.cover}}
          alt=""
          loading="lazy"
          width="200"
          height="300"
          style={{coverStyle}}
        />
      {{else}}
        <span class="book__no-cover" style={{coverStyle}}><Icon @name="bookOpen" /></span>
      {{/if}}
    </a>

    <div class="book__details">
      <h3 class="book__title">
        <a href={{@book.url}} target="_blank" rel="noopener noreferrer">{{@book.title}}</a>
      </h3>
      {{#let (seriesLabel @book) as |series|}}
        {{#if series}}
          <p class="book__series">{{series}}</p>
        {{/if}}
      {{/let}}
      <p class="book__author">{{@book.author.name}}</p>

      {{#if @book.rating}}
        <p class="book__rating" title="My rating: {{@book.rating}} of 5">
          <span class="visually-hidden">My rating: {{@book.rating}} of 5 stars</span>
          {{#each STARS as |star|}}
            <Icon
              @name="star"
              class="book__star {{if (filled star @book.rating) 'book__star--on'}}"
            />
          {{/each}}
        </p>
      {{/if}}

      {{#if @book.review}}
        <blockquote class="book__review">
          <p>{{@book.review}}</p>
        </blockquote>
      {{/if}}
    </div>
  </article>
</template>;

export default BookCard;
