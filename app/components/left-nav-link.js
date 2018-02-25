import Component from '@ember/component';
import { inject as service } from '@ember/service';

const LeftNavLink =  Component.extend({
  tagName: 'button',
  localClassNames: 'left-nav-link',

  router: service(),

  click() {
    this.router.transitionTo(this.name);
  }
});

LeftNavLink.reopenClass({
  positionalParams: ['name']
});

export default LeftNavLink;
