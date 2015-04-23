import DS from 'ember-data';
import moment from 'moment';

export default DS.RESTSerializer.extend({
    normalizePayload: function (payload) {
        if (payload.response && payload.response.posts) {
            var posts = payload.response.posts.map(function(post) {
                // TODO: Remove this and update model to handle the arrays
                delete post.tags;
                delete post.highlighted;
                // Serialize the dates for cross-browser support
                post.date = moment(post.date, 'YYYY-MM-DD HH:mm:ss GMT').toISOString();
                return post;
            });
            return { posts: posts };
        }

        return payload;
    }
});
