import DS from 'ember-data';
import { camelize } from '@ember/string';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';

const { RESTAdapter } = DS;

export default RESTAdapter.extend({
  host: 'https://api.twitch.tv/helix',
  clientId: 'gxz07x8f6xtut1t7aiv31tyw6qhnmq',

  headers: computed('clientId', function () {
    return { 'Client-Id': this.clientId };
  }),

  pathForType(type) {
    return camelize(pluralize(type.replace('twitch', '')));
  },
});
