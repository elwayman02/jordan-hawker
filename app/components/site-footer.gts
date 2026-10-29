import Icon from "#components/icon.gts";
import SocialLinks from "#components/social-links.gts";
import { hellaDrunk, site, socialLinks } from "#app/data/site.ts";

import "./site-footer.css";

const year = new Date().getFullYear();

<template>
  <footer class="site-footer" id="contact">
    <div class="wrap">
      <div class="site-footer__contact">
        <div class="stack">
          <p class="eyebrow">hello</p>
          <h2 class="site-footer__title">Let’s talk.</h2>
          <p class="muted">
            Whether it’s a role, a project, a talk, or a track — my inbox is open.
          </p>
          <p>
            <a class="button primary" href="mailto:{{site.email}}">
              <Icon @name="mail" />
              {{site.email}}
            </a>
          </p>
        </div>

        <SocialLinks @links={{socialLinks}} @detailed={{true}} />
      </div>

      <div class="site-footer__meta">
        <p>© 2015–{{year}} {{site.name}}</p>
        <p>
          Also pouring at
          <a
            href={{hellaDrunk.url}}
            target="_blank"
            rel="noopener noreferrer"
          >{{hellaDrunk.name}}</a>
        </p>
        <p>
          Built with
          <a href="https://emberjs.com" target="_blank" rel="noopener noreferrer">Ember</a>
          ·
          <a href={{site.repoUrl}} target="_blank" rel="noopener noreferrer">source on GitHub</a>
        </p>
      </div>
    </div>
  </footer>
</template>
