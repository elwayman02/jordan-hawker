import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('twitch');
  this.route('code');
  this.route('contact');
  this.route('blog');
  this.route('posts');
  this.route('post', { path: '/p/:post_slug' });
  this.route('deprecated-post', { path: '/posts/:post_slug' });
});

export default Router;
