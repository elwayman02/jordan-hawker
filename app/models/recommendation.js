import DS from 'ember-data';

export default DS.Model.extend({
    recommendationText: DS.attr('string'),
    recommendationType: DS.hasOneFragment('recommendation-type'),
    recommender: DS.hasOneFragment('recommender')
});
