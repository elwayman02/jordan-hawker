import Ember from 'ember';

export default Ember.Route.extend({
    intl: Ember.inject.service(),
    beforeModel() {
        this.get('intl').setLocale('en-us');
    },

    activate() {
        Ember.$('html').velocity('scroll', { offset: 0, duration: 150 });
    }
});
