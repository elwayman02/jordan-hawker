import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  localClassNames: 'recommendation-item',

  recommendation: null,

  fullName: computed('recommendation.{firstName,lastName}', function () {
    let name = this.get('recommendation.firstName');
    let lastName = this.get('recommendation.lastName');
    if (lastName) {
      name = `${name} ${lastName}`;
    }
    return name;
  })
});
