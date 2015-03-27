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

    leftIndex: function () {
        var index = this.get('index');

        if (index > 0) {
            return index - 1;
        }

        return this.get('content.length') - 1;
    }.property('index', 'content.[]'),

    rightIndex: function () {
        var index = this.get('index');
        var length = this.get('content.length');

        if (index < (length - 1)) {
            return index + 1;
        }

        return 0;
    }.property('index', 'content.[]'),

    leftItem: function () {
        return this.get('content')[this.get('leftIndex')];
    }.property('content.[]', 'leftIndex'),

    mainItem: function () {
        return this.get('content')[this.get('index')];
    }.property('content.[]', 'index'),

    rightItem: function () {
        return this.get('content')[this.get('rightIndex')];
    }.property('content.[]', 'rightIndex'),

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
