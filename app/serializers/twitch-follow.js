import DS from 'ember-data';
import { decamelize } from '@ember/string';

export default DS.RESTSerializer.extend({
  keyForAttribute(attr) {
    return decamelize(attr);
  },

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    let data = payload.data.map((follow) => {
      follow.id = `${follow.from_id}${follow.to_id}`;
      return follow;
    });
    let wrappedPayload = { [primaryModelClass.modelName]: data };

    return this._super(store, primaryModelClass, wrappedPayload, id, requestType);
  },
});
