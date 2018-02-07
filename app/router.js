import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      this.get('metrics').trackPage({ page, title });
    });
  }
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
