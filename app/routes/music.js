import Route from '@ember/routing/route';

export default Route.extend({
  isInteractive(didReportInteractive) {
    return didReportInteractive('dj-promo') & didReportInteractive('dj-events');
  }
});
