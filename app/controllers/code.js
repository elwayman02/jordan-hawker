import Ember from 'ember';

export default Ember.Controller.extend({
    recommendations: Ember.computed.alias('model.recommendations.content.content'),

    carouselIndex: Ember.computed('recommendations', function () { // randomize default index
        var length = this.get('recommendations.length');

        return Math.floor((Math.random() * length));
    })
});
