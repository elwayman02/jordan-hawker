import Route from '@ember/routing/route';
import RouteInteractivityMixin from 'ember-interactivity/mixins/route-interactivity';
import ResetScrollMixin from 'jordan-hawker/mixins/reset-scroll';

Route.reopen(RouteInteractivityMixin);
Route.reopen(ResetScrollMixin);
