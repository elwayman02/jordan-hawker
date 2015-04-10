import Ember from 'ember';

export default Ember.Component.extend({
    index: 0,

    init: function () {
        this._super.apply(this, arguments);

        this.scheduleChange();
    },

    scheduleChange: function () { // Change every 30 seconds
        Ember.run.later(this, this.changeIndex, 20000);
    },

    changeIndex: function () {
        this.moveRight();
        this.scheduleChange();
    },

    leftIndex: Ember.computed('index', 'content.[]', function () {
        var index = this.get('index');

        if (index > 0) {
            return index - 1;
        }

        return this.get('content.length') - 1;
    }),

    rightIndex: Ember.computed('index', 'content.[]', function () {
        var index = this.get('index');
        var length = this.get('content.length');

        if (index < (length - 1)) {
            return index + 1;
        }

        return 0;
    }),

    leftItem: Ember.computed('content.[]', 'leftIndex', function () {
        return this.get('content')[this.get('leftIndex')];
    }),

    mainItem: Ember.computed('content.[]', 'index', function () {
        return this.get('content')[this.get('index')];
    }),

    rightItem: Ember.computed('content.[]', 'rightIndex', function () {
        return this.get('content')[this.get('rightIndex')];
    }),

    moveLeft: function () {
        this.set('index', this.get('leftIndex'));
    },

    moveRight: function () {
        this.set('index', this.get('rightIndex'));
    },

    actions: {
        moveLeft: function() {
            this.moveLeft();
        },

        moveRight: function() {
            this.moveRight();
        }
    }
});
