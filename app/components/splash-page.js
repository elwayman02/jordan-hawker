import Component from '@ember/component';
import { computed } from '@ember/object';
import config from '../config/environment';

export default Component.extend({
  localClassNames: 'splash-page',

  version: computed(function () {
    let version = config.APP.version;
    return `Version ${version.substring(0, version.lastIndexOf('.'))}`; // Remove SHA from version
  })
});
