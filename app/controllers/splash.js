import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    version: Ember.computed(function () {
        var version = config.APP.version;
        return 'Version %@'.fmt(version.substring(0, version.lastIndexOf('.'))); // Remove SHA from version
    })
});
