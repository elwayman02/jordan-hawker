import Ember from 'ember';

export default Ember.Controller.extend({
    recommendations: Ember.computed.alias('model.recommendations.content.content'),

    carouselIndex: function () { // randomize default index
        var length = this.get('recommendations.length');

        return Math.floor((Math.random() * length));
    }.property('recommendations')
});
