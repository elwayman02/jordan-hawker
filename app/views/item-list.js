import Ember from 'ember';

export default Ember.CollectionView.extend({
  itemViewClass: Ember.View.extend({
    templateName: 'item-row'
  })
});
