import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  fromId: attr('number'),
  toId: attr('number'),
  followedAt: attr('date')
});
