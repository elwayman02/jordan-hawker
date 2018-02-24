import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    didTransition() {
      let content = document.getElementById('content');
      if (content) {
        content.scrollTop = 0;
      }
    }
  }
});
