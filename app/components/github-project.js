import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'github-project',

  url: computed('repo.{homepage,htmlUrl}', function () {
    let homepage = this.get('repo.homepage');
    return (homepage && homepage.includes('jhawk.co')) ? homepage : this.get('repo.htmlUrl');
  }),

  didInsertElement() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, this.reportInteractive);
  }
});
