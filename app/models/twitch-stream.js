import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  userId: attr('string'),
  gameId: attr('string'),
  type: attr('string'),
  title: attr('string'),
  viewerCount: attr('number'),
  language: attr('string'),
  thumbnailUrl: attr('string'),
  startedAt: attr('date'),
  communityIds: attr()
});
