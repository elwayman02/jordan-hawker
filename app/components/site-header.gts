import { htmlSafe } from "@ember/template";
import { LinkTo } from "@ember/routing";

import ThemeToggle from "#components/theme-toggle.gts";

import "./site-header.css";

/** Every section is exactly five letters. */
const SECTIONS = ["works", "codes", "sound", "votes", "words"] as const;

const letters = (word: string) => [...word];
const delay = (index: number) => htmlSafe(`--i: ${index}`);

<template>
  <header class="site-header">
    <div class="wrap site-header__inner">
      <LinkTo @route="index" class="brand">
        <span class="brand__mark" aria-hidden="true">jh</span>
        <span class="brand__name">Jordan Hawker</span>
      </LinkTo>

      <nav aria-label="Primary" class="site-nav">
        <ul role="list">
          {{#each SECTIONS as |section|}}
            <li>
              <LinkTo @route={{section}} class="site-nav__link" aria-label={{section}}>
                <span class="site-nav__slash" aria-hidden="true">/</span>
                <span class="site-nav__word" aria-hidden="true">
                  {{#each (letters section) as |letter index|}}
                    <span style={{delay index}}>{{letter}}</span>
                  {{/each}}
                </span>
              </LinkTo>
            </li>
          {{/each}}
        </ul>
      </nav>

      <ThemeToggle />
    </div>
  </header>
</template>
