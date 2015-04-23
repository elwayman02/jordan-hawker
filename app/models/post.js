import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
    blog_name: attr('string'),
    post_url: attr('string'),
    slug: attr('string'),
    type: attr('string'),
    date: attr('date'),
    timestamp: attr('number'),
    state: attr('string'),
    format: attr('string'),
    reblog_key: attr('string'),
    short_url: attr('string'),
    note_count: attr('number'),
    title: attr('string'),
    body: attr('string'),
});
