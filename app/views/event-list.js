import Ember from 'ember';

export default Ember.CollectionView.extend({
  content: function () {
    return this.get('list').sortBy('name');
  }.property('list.[]'),

  itemViewClass: Ember.View.extend({
    templateName: 'event-row',

    styleList: function () {
      return this.get('content.styles').sort().join(', ');
    }.property('content.styles.[]'),

    dateList: function () {
      var dates = this.get('content.dates');
      if (!Ember.isEmpty(dates)) {
        return dates.join(', ');
      }
    }.property('content.dates.[]')
  })
});