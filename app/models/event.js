import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr('string'),
  location: attr('string'),
  type: attr('string'),
  styles: attr(),
  dates: attr()
});
