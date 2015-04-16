import DS from 'ember-data';

export default DS.RESTSerializer.extend({
    normalizePayload: function (payload) {
        if (payload.response && payload.response.posts) {
            var posts = payload.response.posts.map(function(post) {
                // TODO: Remove this and update model to handle the arrays
                delete post.tags;
                delete post.highlighted;
                return post;
            });
            return { posts: posts };
        }

        return payload;
    }
});
