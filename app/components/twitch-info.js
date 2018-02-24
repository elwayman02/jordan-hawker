import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  localClassNames: 'twitch-info',

  store: service(),

  user: null,
  username: null,
  videos: null,

  url: computed('user', function () {
    return `https://www.twitch.tv/${this.get('user.login')}`;
  }),

  init() {
    this._super(...arguments);

    let username = this.get('username');
    if (username) {
      this.get('store').queryRecord('twitch-user', { login: username }).then((user) => {
        this.set('user', user);

        this.get('store').query('twitch-video', { user_id: user.get('id') }).then((videos) => {
          this.set('videos', videos);
        });
      });
    }
  }
});
