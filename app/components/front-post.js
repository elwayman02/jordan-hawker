import TumblrPostText from 'ember-tumblr/components/tumblr-post-text';

export default TumblrPostText.extend({
    //layoutName: 'components/tumblr-post-text',
    expandAction: 'viewBlog',
    actions: {
        expand() {
            this.sendAction('expandAction');
        }
    }
});
