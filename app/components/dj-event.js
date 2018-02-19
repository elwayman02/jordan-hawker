import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'dj-event',

  event: null,

  danceStyles: computed('event.styles', function () {
    let styles = this.get('event.styles');
    if (styles) {
      return this.get('event.styles').join(', ');
    }
  }),

  dates: computed('event.dates', function () {
    let dates = this.get('event.dates');
    if (dates) {
      return this.get('event.dates').join(', ');
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, this.reportInteractive);
  }
});
