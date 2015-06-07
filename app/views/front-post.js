import Post from 'jordan-hawker/views/post-view';

export default Post.extend({
    actions: {
        expand() {
            this.get('controller').send('viewBlog');
        }
    }
});
