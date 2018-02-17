import TwitchAdapter from './twitch';

export default TwitchAdapter.extend({
  pathForType() {
    return this._super(...arguments).replace('follows', 'users/follows');
  },
});
