import Ember from 'ember';

export default Ember.Controller.extend({
  isSplashPage: Ember.computed('currentRouteName', function () {
    return this.get('currentRouteName') === 'splash';
  })
});
