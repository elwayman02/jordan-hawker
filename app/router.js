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

      this.get('metrics').trackPage({ page, title, event: 'pageViewed' });
    });
  }
});

Router.map(function() {
  this.route('contact');
  this.route('blog');
  this.route('music');
  this.route('post', { path: '/p/:post_slug' });
  this.route('posts');
  this.route('projects');
  this.route('resume');
  this.route('twitch');
  this.route('deprecated-post', { path: '/posts/:post_slug' });
  this.route('about');
  this.route('deprecated-ember', { path: '/ember' });
  this.route('deprecated-candidate', { path: '/the-candidate' });
  this.route('deprecated-dance', { path: '/dance' });
});

export default Router;
