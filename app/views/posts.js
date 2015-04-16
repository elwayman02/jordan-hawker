import Ember from 'ember';
import Post from 'jordan-hawker/views/post';

export default Ember.CollectionView.extend({
    itemViewClass: Post
});
