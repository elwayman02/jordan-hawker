import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'recommendation-item',

  recommendation: null,

  fullName: computed('recommendation.{firstName,lastName}', function () {
    let name = this.get('recommendation.firstName');
    let lastName = this.get('recommendation.lastName');
    if (lastName) {
      name = `${name} ${lastName}`;
    }
    return name;
  }),

  didInsertElement() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, this.reportInteractive);
  }
});
