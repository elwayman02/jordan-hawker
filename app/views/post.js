import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'post',
    expanded: false,

    expandText: Ember.computed('expanded', function () {
        return this.get('expanded') ? 'Collapse Post' : 'View More';
    }),

    actions: {
        expand: function () {
            this.toggleProperty('expanded');
        }
    }
});
