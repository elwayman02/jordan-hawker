import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('contact');
  this.route('music');
  this.route('dance');
  this.route('code');
  this.route('blog', { path: '/posts' });
  this.route('post', { path: '/posts/:post_id' });
});
