import Ember from 'ember';
import TechRow from 'jordan-hawker/views/tech-row';

export default Ember.CollectionView.extend({
  content: Ember.computed('list.[]', function () {
    return this.get('list').sortBy('name');
  }),

  itemViewClass: TechRow
});
