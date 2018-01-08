import Component from '@ember/component';
import { inject as injectService } from '@ember/service';

export default Component.extend({
  localClassNames: 'header-bar',

  router: injectService(),

  actions: {
    goToIndex() {
      this.get('router').transitionTo('index');
    }
  }
});
