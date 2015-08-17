import Ember from 'ember';
import Visitor from '../models/visitor';

export default Ember.Route.extend({
    visitor: Visitor.create(),

    checkSplashSeen: Ember.on('activate', function () {
        if (this.get('visitor.splashSeen')) {
            this.transitionTo('index');
        }
        this.set('visitor.splashSeen', true);
    })
});
