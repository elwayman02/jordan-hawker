import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  fastboot: service(),
  actions: {
    didTransition() {
      if(this.get('fastboot.isFastBoot')) {
        return;
      }

      let content = document.getElementById('content');
      if (content) {
        content.scrollTop = 0;
      }
    }
  }
});
