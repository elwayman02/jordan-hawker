import { moduleForComponent, test } from 'ember-qunit';

var component;

moduleForComponent('tech-item', {
    setup: function () {
        component = this.subject();
        component.set('item', {});
    }
});

test('it exists', function(assert) {
    assert.ok(component);
});

test('hasDescription', function(assert) {
    assert.ok(!component.get('hasDescription'), 'is false when there is no description');

    component.set('item.description', 'Foo Bar');
    assert.ok(component.get('hasDescription'), 'is true when there is a description');
});

test('showDescription', function(assert) {
    assert.ok(!component.get('showDescription'), 'is false when there is no description or expand');

    component.toggleProperty('expandDescription');
    assert.ok(!component.get('showDescription'), 'is false when there is no description but expand is true');

    component.toggleProperty('expandDescription');
    component.set('item.description', 'Foo Bar');
    assert.ok(!component.get('showDescription'), 'is false when there is a description but expand is false');

    component.toggleProperty('expandDescription');
    assert.ok(component.get('showDescription'), 'is true when there is a description and expand is true');
});
