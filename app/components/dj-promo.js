import Component from '@ember/component';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'dj-promo',

  isInteractive(didReportInteractive) {
    return didReportInteractive('dj-bio');
  }
});
