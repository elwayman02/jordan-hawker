import DS from 'ember-data';
import { decamelize } from '@ember/string';

export default DS.RESTSerializer.extend({
  keyForAttribute(attr) {
    return decamelize(attr);
  },

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    let wrappedPayload = { [primaryModelClass.modelName]: payload.data };

    return this._super(store, primaryModelClass, wrappedPayload, id, requestType);
  },
});
