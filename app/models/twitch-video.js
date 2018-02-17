import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { computed } from '@ember/object';

export default Model.extend({
  userId: attr('number'),
  title: attr('string'),
  description: attr('string'),
  thumbnailUrl: attr('string'),
  language: attr('string'),
  duration: attr('string'),
  viewCount: attr('number'),
  createdAt: attr('date'),
  publishedAt: attr('date'),

  thumbnailImg: computed('thumbnailUrl', function () {
    return this.get('thumbnailUrl').replace('%{width}', '160').replace('%{height}', '90');
  }),

  url: computed('id', function () {
    return `https://www.twitch.tv/videos/${this.get('id')}`;
  })
});
