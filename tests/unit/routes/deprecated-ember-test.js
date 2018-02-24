import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | deprecated-ember', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:deprecated-ember');
    assert.ok(route);
  });
});
