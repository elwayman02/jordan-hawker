import Ember from 'ember';
import Visitor from '../models/visitor';

export default Ember.Route.extend({
    visitor: Visitor.create(),

    checkSplashSeen: Ember.on('activate', function () {
        if (this.get('visitor.hideSplash')) {
            this.transitionTo('index');
        }
    }),

    actions: {
        willTransition() {
            if (this.controller.get('hideSplash')) {
                this.set('visitor.hideSplash', true);
            }
        }
    }
});
