import DS from 'ember-data';

export default DS.ModelFragment.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  name: function () {
      return '%@ %@'.fmt(this.get('firstName'), this.get('lastName'));
  }.property('firstName', 'lastName')
});
