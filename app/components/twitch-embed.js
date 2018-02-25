import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  localClassNames: 'twitch-embed',

  activeUsername: 'axlehellfire',
  followUser: null,
  defaultUsernames: null,

  store: service(),

  init() {
    this._super(...arguments);

    this.set('defaultUsernames', ['axlehellfire', 'boardgames']);

    this.findActiveStream({ user_login: this.defaultUsernames }).then((id) => {
      if (id) {
        this.loadActiveUser(id);
      } else {
        this.findDefaultUser().then((id) => {
          return this.loadFollows(id);
        }).then((ids) => {
          return this.findActiveStream({ user_id: ids });
        }).then((id) => {
          this.loadActiveUser(id);
        });
      }
    });


  },

  findDefaultUser() {
    return this.findUser('axlehellfire');
  },

  findUser(username) {
    return this.store.queryRecord('twitch-user', { login: username }).then((user) => {
      return user.get('id');
    });
  },

  loadFollows(id) {
    return this.store.query('twitch-follow', { from_id: id, first: 98 }).then((follows) => {
      return follows.map((follow) => {
        return follow.get('toId');
      });
    });
  },

  findActiveStream(query) {
    return this.store.query('twitch-stream', query).then((streams) => {
      let streamCount = streams.get('length');
      let liveId;

      if (streamCount === 1) {
        liveId = streams.get('firstObject.userId');
      } else if (streamCount > 1) {
        let id;
        streams.forEach((stream) => {
          if (liveId) {
            return;
          }
          if (stream.get('type') === 'live') {
            liveId = stream.get('userId');
          } else {
            id = stream.get('userId');
          }
        });
        if (!liveId) {
          liveId = id;
        }
      }

      return liveId;
    });
  },

  loadActiveUser(id) {
    this.store.queryRecord('twitch-user', { id }).then((user) => {
      this.set('activeUsername', user.get('login'));
      if (!this.defaultUsernames.includes(user.get('login'))) {
        this.set('followUser', user);
      }
    });
  },

  embedUrl: computed('activeUsername', function () {
    return `https://embed.twitch.tv/?channel=${this.activeUsername}&theme=dark`;
  }),

  axleButtonClass: computed('activeUsername', function () {
    if (this.activeUsername === 'axlehellfire') {
      return 'active';
    }
  }),

  tiltedButtonClass: computed('activeUsername', function () {
    if (this.activeUsername === 'boardgames') {
      return 'active';
    }
  }),

  followButtonClass: computed('{activeUsername,followUser}', function () {
    if (this.activeUsername === this.get('followUser.login')) {
      return 'active';
    }
  }),

  actions: {
    toggle(username) {
      this.set('activeUsername', username);
    }
  }
});
