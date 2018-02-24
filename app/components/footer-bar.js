import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  localClassNames: 'footer-bar',

  currentYear: computed(function () {
    return new Date().getFullYear();
  })
});
