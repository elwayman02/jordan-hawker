import { moduleFor, test } from 'ember-qunit';

var view;

moduleFor('view:tech-row', {
    setup: function () {
        view = this.subject();
        view.set('content', {});
    }
});

test('it exists', function(assert) {
    ok(view);
});

test('hasDescription', function () {
    ok(!view.get('hasDescription'), 'is false when there is no description');

    view.set('content.description', 'Foo Bar');
    ok(view.get('hasDescription'), 'is true when there is a description');
});

test('showDescription', function () {
    ok(!view.get('showDescription'), 'is false when there is no description or expand');

    view.toggleProperty('expandDescription');
    ok(!view.get('showDescription'), 'is false when there is no description but expand is true');

    view.toggleProperty('expandDescription');
    view.set('content.description', 'Foo Bar');
    ok(!view.get('showDescription'), 'is false when there is a description but expand is false');

    view.toggleProperty('expandDescription');
    ok(view.get('showDescription'), 'is true when there is a description and expand is true');
});
