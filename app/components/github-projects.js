import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'github-projects',

  store: service(),

  loading: true,

  repos: null,

  sourceRepos: computed.filterBy('repos', 'fork', false),

  init() {
    this._super(...arguments);

    this.set('repos', []);

    this.store.query('github-repository', { user: 'elwayman02', sort: 'updated' }).then((repos) => {
      this.set('repos', repos);
      this.set('loading', false);
    });
  },

  isInteractive(didReportInteractive) {
    return !this.loading && didReportInteractive('github-project', { count: this.get('sourceRepos.length') });
  }
});
