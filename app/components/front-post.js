import TumblrPostText from 'ember-tumblr/components/tumblr-post-text';
import { inject as service } from '@ember/service';

export default TumblrPostText.extend({
  layoutName: 'components/tumblr-post-text',

  localClassNames: 'front-post',

  store: service(),

  post: null,

  init() {
    this._super(...arguments);

    this.get('store').queryRecord('tumblr-post-text', {
      limit: 1
    }).then((post) => {
      this.set('post', post);
    });
  },
});
