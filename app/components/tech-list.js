import Ember from 'ember';

export default Ember.Component.extend({
    sortProperties: ['name:asc'],
    items: Ember.computed.sort('content.list', 'sortProperties')
});
