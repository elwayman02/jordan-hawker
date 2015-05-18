import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    version: Ember.computed(function () {
        var version = config.APP.version;
        version = version.substring(0, version.lastIndexOf('.'));
        return 'Version %@'.fmt(version);
    })
});
