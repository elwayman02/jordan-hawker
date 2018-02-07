import Route from '@ember/routing/route';

export default Route.extend({
  model(params/*, transition*/) {
    return this.get('store').queryRecord('tumblr-post-text', {
      id: params.post_slug
    });
  },

  actions: {
    didTransition() {
      document.getElementById('content').scrollTop = 0;
    }
  }
});
