import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | deprecated post', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:deprecated-post');
    assert.ok(route);
  });
});
