import DS from 'ember-data';

export default DS.RESTSerializer.extend({
    normalizePayload(payload) {
        return { recommendations: payload.recommendationsReceived.values };
    }
});
