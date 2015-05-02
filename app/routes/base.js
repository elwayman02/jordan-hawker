import Ember from 'ember';

export default Ember.Route.extend({
    activate: function () {
        Ember.$('html').velocity('scroll', { offset: 0, duration: 150 });
    }
});
