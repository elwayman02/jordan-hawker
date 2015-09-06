import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('splash', { path: '/' });
  this.route('index');
  this.route('contact');
  this.route('music');
  this.route('dance');
  this.route('code');
  this.route('blog', { path: '/posts' });
  this.route('post', { path: '/posts/:post_id' });
  this.route('the-candidate');
  this.route('ember');
});

export default Router;
