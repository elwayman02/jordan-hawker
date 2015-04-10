import Ember from 'ember';
import EventRowView from 'jordan-hawker/views/event-row';

export default Ember.CollectionView.extend({
  content: Ember.computed('list.[]', function () {
    return this.get('list').sortBy('name');
  }),

  itemViewClass: EventRowView
});
