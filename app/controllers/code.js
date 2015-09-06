import Ember from 'ember';

export default Ember.Controller.extend({
    carouselIndex: Ember.computed('model.recommendations.[]', function () { // randomize default index
        return Math.floor((Math.random() * this.get('model.recommendations.length')));
    })
});
