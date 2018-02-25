import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'dj-events',

  store: service(),

  events: null,

  loading: true,

  init() {
    this._super(...arguments);

    this.set('events', []);

    this.store.findAll('event').then((events) => {
      this.set('events', events);
      this.set('loading', false);
    });
  },

  weekendEvents: computed.filterBy('events', 'type', 'weekend'),

  recurringEvents: computed.filterBy('events', 'type', 'recurring'),

  isInteractive(didReportInteractive) {
    return !this.loading && didReportInteractive('dj-event', { count: this.get('events.length') });
  }
});
