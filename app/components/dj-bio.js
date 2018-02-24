import Component from '@ember/component';
import { run } from '@ember/runloop';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'dj-bio',

  didInsertElement() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, this.reportInteractive);
  }
});
