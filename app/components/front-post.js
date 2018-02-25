import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  localClassNames: 'front-post',

  store: service(),

  post: null,

  init() {
    this._super(...arguments);

    this.store.queryRecord('tumblr-post-text', {
      limit: 1
    }).then((post) => {
      this.set('post', post);
    });
  },
});
