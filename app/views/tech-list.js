import Ember from 'ember';
import TechRow from 'jordan-hawker/views/tech-row';

export default Ember.CollectionView.extend({
  content: function () {
    return this.get('list').sortBy('name');
  }.property('list.[]'),

  itemViewClass: TechRow
});
