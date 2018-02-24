import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | deprecated-dance', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:deprecated-dance');
    assert.ok(route);
  });
});
