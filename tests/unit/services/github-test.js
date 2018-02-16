import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | github', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:github');
    assert.ok(service);
  });
});

