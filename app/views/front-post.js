import Post from 'jordan-hawker/views/post-view';

export default Post.extend({
    actions: {
        expand: function () {
            this.get('controller').send('viewBlog');
        }
    }
});
