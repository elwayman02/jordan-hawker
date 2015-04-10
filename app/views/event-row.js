import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'event-row',

  styleList: Ember.computed('content.styles.[]', function () {
    return this.get('content.styles').sort().join(', ');
  }),

  dateList: Ember.computed('content.dates.[]', function () {
    var dates = this.get('content.dates');
    if (!Ember.isEmpty(dates)) {
      return dates.join(', ');
    }
  })
});
