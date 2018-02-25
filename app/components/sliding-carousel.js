import Component from '@ember/component';
import { computed } from '@ember/object';
import { later, run } from '@ember/runloop';
import ComponentInteractivity from 'ember-interactivity/mixins/component-interactivity';

export default Component.extend(ComponentInteractivity, {
  localClassNames: 'sliding-carousel',

  index: 0,

  init() {
    this._super(...arguments);

    this.scheduleChange();
  },

  scheduleChange() { // Change every 30 seconds
    later(this, this.changeIndex, 20000);
  },

  changeIndex() {
    if (!this.isDestroyed) {
      this.moveRight();
      this.scheduleChange();
    }
  },

  leftIndex: computed('index', 'content.[]', function () {
    const index = this.index;

    if (index > 0) {
      return index - 1;
    }

    return this.get('content.length') - 1;
  }),

  rightIndex: computed('index', 'content.[]', function () {
    const index = this.index;

    if (index < (this.get('content.length') - 1)) {
      return index + 1;
    }

    return 0;
  }),

  leftItem: computed('content.[]', 'leftIndex', function () {
    return this.content.objectAt(this.leftIndex);
  }),

  mainItem: computed('content.[]', 'index', function () {
    return this.content.objectAt(this.index);
  }),

  rightItem: computed('content.[]', 'rightIndex', function () {
    return this.content.objectAt(this.rightIndex);
  }),

  moveLeft() {
    this.set('index', this.leftIndex);
  },

  moveRight() {
    this.set('index', this.rightIndex);
  },

  didInsertElement() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, this.reportInteractive);
  },

  actions: {
    moveLeft() {
      this.moveLeft();
    },

    moveRight() {
      this.moveRight();
    }
  }
});
