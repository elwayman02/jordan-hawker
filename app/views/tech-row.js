import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'tech-row',

    expandDescription: false,

    hasDescription: Ember.computed('content.description', function () {
        return !Ember.isEmpty(this.get('content.description'));
    }),

    showDescription: Ember.computed('hasDescription', 'expandDescription', function () {
        return this.get('hasDescription') && this.get('expandDescription');
    }),

    rowClasses: Ember.computed('showDescription', function () {
        if (this.get('showDescription')) {
            return 'col-xs-12 col-sm-10 toggled';
        }
        return 'col-xs-6 col-sm-4 col-md-3';
    }),

    actions: {
        toggleDescription: function () {
            this.toggleProperty('expandDescription');
        }
    }
});
