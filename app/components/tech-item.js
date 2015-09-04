import Ember from 'ember';

export default Ember.Component.extend({
    expandDescription: false,

    hasDescription: Ember.computed('item.description', function () {
        return !Ember.isEmpty(this.get('item.description'));
    }),

    showDescription: Ember.computed('hasDescription', 'expandDescription', function () {
        return this.get('hasDescription') && this.get('expandDescription');
    }),

    rowClasses: Ember.computed('showDescription', function () {
        if (this.get('showDescription')) {
            return 'tech-description col-xs-12 col-sm-10 toggled';
        }
        return 'tech-description col-xs-6 col-sm-4 col-md-3';
    }),

    actions: {
        toggleDescription() {
            this.toggleProperty('expandDescription');
        }
    }
});
