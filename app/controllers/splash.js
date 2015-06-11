import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    version: Ember.computed(function () {
        const version = config.APP.version;
        return `Version ${version.substring(0, version.lastIndexOf('.'))}`; // Remove SHA from version
    })
});
