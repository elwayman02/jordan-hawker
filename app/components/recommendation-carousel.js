import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  store: service(),

  loading: true,

  recommendations: null,

  init() {
    this._super(...arguments);

    this.set('recommendations', []);

    this.store.findAll('recommendation').then((recommendations) => {
      this.set('recommendations', recommendations);
      this.set('loading', false);
    });
  },

  isInteractive(didReportInteractive) {
    return !this.loading && didReportInteractive('recommendation-item');
  }
});
