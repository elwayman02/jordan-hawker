import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  login: attr('string'),
  displayName: attr('string'),
  type: attr('string'),
  broadcasterType: attr('string'),
  description: attr('string'),
  profileImageUrl: attr('string'),
  offlineImageUrl: attr('string'),
  email: attr('string'),
  viewCount: attr('number'),
});
