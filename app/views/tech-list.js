import Ember from 'ember';

export default Ember.CollectionView.extend({
  content: function () {
    return this.get('list').sortBy('name');
  }.property('list.[]'),

  itemViewClass: Ember.View.extend({
    templateName: 'tech-row'
  })
});
