import DS from 'ember-data';

export default DS.RESTSerializer.extend({
    normalizePayload: function (payload) {
        var data = {
            recommendations: payload.recommendationsReceived.values
        };

        return data;
    }
});
