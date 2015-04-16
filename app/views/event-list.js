import Ember from 'ember';
import EventRowView from 'jordan-hawker/views/event-row';

export default Ember.CollectionView.extend({
  itemViewClass: EventRowView,

  sortProperties: ['name:asc'],
  content: Ember.computed.sort('list', 'sortProperties')
});
