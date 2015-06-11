import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'navbar',

  actions: {
      click() {
          // Will break of sub-menus are added; add the action to link-tos instead
          // https://github.com/twbs/bootstrap/issues/12852#issuecomment-59621810
          this.$('.navbar-collapse.in').collapse('hide');
      }
  }
});
