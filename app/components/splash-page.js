import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';
import config from '../config/environment';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'splash-page',

  version: computed(function () {
    let version = config.APP.version;
    return `Version ${version.substring(0, version.lastIndexOf('.'))}`; // Remove SHA from version
  }),

  didInsertElement() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, this.reportInteractive);
  }
});
