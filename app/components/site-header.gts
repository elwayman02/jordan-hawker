import { htmlSafe } from "@ember/template";
import { LinkTo } from "@ember/routing";

import ThemeToggle from "#components/theme-toggle.gts";
import { site } from "#app/data/site.ts";
import { SECTIONS } from "#shared/sections.ts";

import "./site-header.css";

const letters = (word: string) => [...word];
const delay = (index: number) => htmlSafe(`--i: ${index}`);

<template>
  <header class="site-header">
    <div class="wrap site-header__inner">
      <LinkTo @route="index" class="brand">
        <span class="brand__mark" aria-hidden="true">jh</span>
        <span class="brand__name">{{site.name}}</span>
      </LinkTo>

      <nav aria-label="Primary" class="site-nav">
        <ul role="list">
          {{#each SECTIONS as |section|}}
            <li>
              <LinkTo @route={{section.name}} class="site-nav__link" aria-label={{section.name}}>
                <span class="site-nav__slash" aria-hidden="true">/</span>
                <span class="site-nav__word" aria-hidden="true">
                  {{#each (letters section.name) as |letter index|}}
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
