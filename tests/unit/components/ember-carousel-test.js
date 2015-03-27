import {
  moduleForComponent,
  test
} from 'ember-qunit';

var component;

moduleForComponent('ember-carousel', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  needs: ['component:ember-carousel-item'],
  setup: function () {
      component = this.subject();
      component.set('content', []);
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
