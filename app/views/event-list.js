import Ember from 'ember';
import EventRowView from 'jordan-hawker/views/event-row';

export default Ember.CollectionView.extend({
  content: function () {
    return this.get('list').sortBy('name');
  }.property('list.[]'),

  itemViewClass: EventRowView
});
