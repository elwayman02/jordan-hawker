import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  localClassNames: 'twitch-embed',

  username: 'axlehellfire',

  chatUrl: computed('username', function () {
    return `https://www.twitch.tv/embed/${this.get('username')}/chat`;
  }),

  videoUrl: computed('username', function () {
    return `https://player.twitch.tv/?channel=${this.get('username')}`;
  }),

  axleButtonClass: computed('username', function () {
    if (this.get('username') === 'axlehellfire') {
      return 'active';
    }
  }),

  tiltedButtonClass: computed('username', function () {
    if (this.get('username') === 'boardgames') {
      return 'active';
    }
  }),

  actions: {
    toggle(username) {
      this.set('username', username);
    }
  }
});
