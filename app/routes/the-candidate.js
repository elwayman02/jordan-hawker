import BaseRoute from 'jordan-hawker/routes/base';

export default BaseRoute.extend({
    model() {
        return this.store.find('tumblr-post-text', { tag: 'TheCandidate' });
    }
});