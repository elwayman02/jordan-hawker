import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'tech-row',

    expandDescription: false,

    hasDescription: function () {
        return !Ember.isEmpty(this.get('content.description'));
    }.property('content.description'),

    showDescription: function () {
        return this.get('hasDescription') && this.get('expandDescription');
    }.property('hasDescription', 'expandDescription'),

    rowClasses: function () {
        if (this.get('showDescription')) {
            return 'col-xs-12 col-sm-10 toggled';
        }
        return 'col-xs-6 col-sm-4 col-md-3';
    }.property('showDescription'),

    actions: {
        toggleDescription: function () {
            this.toggleProperty('expandDescription');
        }
    }
});
