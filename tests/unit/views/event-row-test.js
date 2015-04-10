import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';

var view;
var styles = ['Blues', 'Swing', 'Fusion'];
var dates = ['2012', '2013', '2014'];

moduleFor('view:event-row', {
  setup: function () {
    view = this.subject();
    view.set('content', {
      styles: Ember.A(styles),
      dates: Ember.A(dates)
    });
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  assert.ok(view);
});

test('styleList', function(assert) {
  assert.equal(view.get('styleList'), 'Blues, Fusion, Swing', 'sorted and concatenated by default');

  var sList = view.get('content.styles').pushObject('Lindy');
  assert.equal(view.get('styleList'), 'Blues, Fusion, Lindy, Swing', 're-sorts when the array changes');
});

test('dateList', function(assert) {
  assert.equal(view.get('dateList'), '2012, 2013, 2014', 'concatenates dates');
});
