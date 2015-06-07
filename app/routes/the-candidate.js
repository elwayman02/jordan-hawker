import BaseRoute from 'jordan-hawker/routes/base';

export default BaseRoute.extend({
    model: function () {
        return this.store.find('post', { tag: 'TheCandidate' });
    }
});
