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

    this.findDefaultUsers().then((ids) => {
      return this.loadFollows(ids);
    }).then((ids) => {
      return this.findActiveStream(ids);
    }).then((id) => {
      this.loadActiveUser(id);
    });
  },

  findDefaultUsers() {
    let ids = [];
    // For some reason the Twitch API doesn't like you to send multiple encoded logins, so we have to chain requests...
    return this.findUser('axlehellfire', ids).then((newIds) => {
      return this.findUser('boardgames', newIds);
    });
  },

  findUser(username, ids) {
    return this.get('store').queryRecord('twitch-user', { login: username }).then((user) => {
      ids.push(user.get('id'));
      return ids;
    });
  },

  loadFollows(ids) {
    return this.get('store').query('twitch-follow', { from_id: ids[0], first: 98 }).then((follows) => {
      return ids.concat(follows.map((follow) => {
        return follow.get('toId');
      }));
    });
  },

  findActiveStream(ids) {
    return this.get('store').query('twitch-stream', { user_id: ids }).then((streams) => {
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
    this.get('store').queryRecord('twitch-user', { id }).then((user) => {
      this.set('activeUsername', user.get('login'));
      if (!this.get('defaultUsernames').includes(user.get('login'))) {
        this.set('followUser', user);
      }
    });
  },

  chatUrl: computed('activeUsername', function () {
    return `https://www.twitch.tv/embed/${this.get('activeUsername')}/chat`;
  }),

  videoUrl: computed('activeUsername', function () {
    return `https://player.twitch.tv/?channel=${this.get('activeUsername')}`;
  }),

  axleButtonClass: computed('activeUsername', function () {
    if (this.get('activeUsername') === 'axlehellfire') {
      return 'active';
    }
  }),

  tiltedButtonClass: computed('activeUsername', function () {
    if (this.get('activeUsername') === 'boardgames') {
      return 'active';
    }
  }),

  followButtonClass: computed('activeUsername', 'followUser', function () {
    if (this.get('activeUsername') === this.get('followUser.login')) {
      return 'active';
    }
  }),

  actions: {
    toggle(username) {
      this.set('activeUsername', username);
    }
  }
});
