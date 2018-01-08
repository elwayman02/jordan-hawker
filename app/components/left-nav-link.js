import Component from '@ember/component';
import { inject as injectService } from '@ember/service';

const LeftNavLink =  Component.extend({
  tagName: 'button',
  localClassNames: 'left-nav-link',

  router: injectService(),

  click() {
    this.get('router').transitionTo(this.get('name'));
  }
});

LeftNavLink.reopenClass({
  positionalParams: ['name']
});

export default LeftNavLink;
