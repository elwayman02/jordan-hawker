import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  recommendations: null,

  init() {
    this._super(...arguments);

    this.set('recommendations', []);

    this.get('store').findAll('recommendation').then((recommendations) => {
      this.set('recommendations', recommendations);
    });
  }
});
