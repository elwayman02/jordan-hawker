import Service from '@ember/service';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend({
  repos: null,

  store: service(),

  init() {
    this._super(...arguments);

    this.set('repos', []);

    this.get('store').query('github-repository', { user: 'elwayman02', sort: 'updated' }).then((repos) => {
      this.set('repos', repos);
    });
  },

  sourceRepos: computed.filterBy('repos', 'fork', false)
});
