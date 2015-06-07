import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'post-view',
    expanded: false,
    alwaysExpanded: false,

    isExpanded: Ember.computed('expanded', 'alwaysExpanded', function () {
        return this.get('expanded') || this.get('alwaysExpanded');
    }),

    expandText: Ember.computed('isExpanded', function () {
        return this.get('isExpanded') ? 'Collapse Post' : 'View More';
    }),

    actions: {
        expand() {
            this.toggleProperty('expanded');
        }
    }
});
