import { inject as service } from '@ember/service';
import InteractivityTrackingService from 'ember-interactivity/services/interactivity-tracking';

export default InteractivityTrackingService.extend({
  metrics: service(),

  trackComponent(data) {
    this.metrics.trackEvent(data);
  },

  trackRoute(data) {
    this.metrics.trackEvent(data);
  }
});
