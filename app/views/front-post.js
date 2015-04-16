import Post from 'jordan-hawker/views/post';

export default Post.extend({
    actions: {
        expand: function () {
            this.get('controller').send('viewBlog');
        }
    }
});
