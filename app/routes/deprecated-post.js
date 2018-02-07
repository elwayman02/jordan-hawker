import Route from '@ember/routing/route';

export default Route.extend({
  redirect(model, transition) {
    this.transitionTo('post', transition.params['deprecated-post'].post_slug);
  }
});
