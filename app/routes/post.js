import BaseRoute from 'jordan-hawker/routes/base';

export default BaseRoute.extend({
    model(params/*, transition*/) {
        return this.store.findAll('tumblr-post-text', {
            id: params.post_id
        }).then(function (posts) {
            return posts.get('firstObject');
        });
    }
});
