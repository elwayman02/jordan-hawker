import Ember from 'ember';

export default Ember.Route.extend({
    model: function (params/*, transition*/) {
        return this.store.find('post', {
            id: params.post_id
        }).then(function (posts) {
            return posts.get('firstObject');
        });
    }
});
