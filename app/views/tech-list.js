import Ember from 'ember';
import TechRow from 'jordan-hawker/views/tech-row';

export default Ember.CollectionView.extend({
  itemViewClass: TechRow,

  sortProperties: ['name:asc'],
  content: Ember.computed.sort('list', 'sortProperties')
});
