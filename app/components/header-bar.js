import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  localClassNames: 'header-bar',

  router: service(),

  actions: {
    goToIndex() {
      this.get('router').transitionTo('index');
    }
  }
});
