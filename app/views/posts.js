import Ember from 'ember';
import Post from 'jordan-hawker/views/post-view';

export default Ember.CollectionView.extend({
    itemViewClass: Post,

    sortProperties: ['date:desc'],
    content: Ember.computed.sort('list', 'sortProperties')
});
