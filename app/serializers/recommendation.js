import DS from 'ember-data';

export default DS.RESTSerializer.extend({
    isNewSerializerAPI: true,
    //normalizePayload(payload) {
    //    return { recommendations: payload.recommendationsReceived.values };
    //}
});
