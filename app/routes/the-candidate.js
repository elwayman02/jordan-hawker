import BaseRoute from 'jordan-hawker/routes/base';

export default BaseRoute.extend({
    model() {
        return this.store.findAll('tumblr-post', { tag: 'TheCandidate' });
    }
});
