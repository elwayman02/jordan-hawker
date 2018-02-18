import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  localClassNames: 'dj-events',

  store: service(),

  events: null,

  init() {
    this._super(...arguments);

    this.set('events', []);

    this.get('store').findAll('event').then((events) => {
      this.set('events', events);
    });
  },

  weekendEvents: computed.filterBy('events', 'type', 'weekend'),

  recurringEvents: computed.filterBy('events', 'type', 'recurring'),
});
