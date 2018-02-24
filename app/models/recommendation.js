import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  text: attr('string'),
  firstName: attr('string'),
  lastName: attr('string'),
  role: attr('string'),
  company: attr('string')
});
