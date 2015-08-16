import BaseRoute from 'jordan-hawker/routes/base';

export default BaseRoute.extend({
    model() {
        return this.store.find('tumblr-post-text', {
            limit: 1
        }).then(function (posts) {
            return posts.get('firstObject');
        });
    },

    actions: {
        viewBlog() {
            this.transitionTo('blog');
        }
    }
});
