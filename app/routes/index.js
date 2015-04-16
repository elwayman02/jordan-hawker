import Ember from 'ember';

export default Ember.Route.extend({
    model: function () {
        return this.store.find('post', {
            limit: 1
        }).then(function (posts) {
            return posts.get('firstObject');
        });
    },

    actions: {
        viewBlog: function () {
            this.transitionTo('blog');
        }
    }
});
