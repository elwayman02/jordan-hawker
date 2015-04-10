import Ember from 'ember';
import DS from 'ember-data';

export default DS.ModelFragment.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  name: Ember.computed('firstName', 'lastName', function () {
      return '%@ %@'.fmt(this.get('firstName'), this.get('lastName'));
  })
});
