import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return [{
      title: 'Tech Sites',
      list: [{
        name: 'GitHub',
        url: ''
      }, {
        name: 'StackOverflow',
        url: ''
      }]
    }, {
      title: 'Frameworks',
      list: [{
        name: 'Ember',
        url: ''
      }, {
        name: 'Backbone',
        url: ''
      }]
    }, {
      title: 'Utility Libraries',
      list: [{
        name: 'jQuery',
        url: ''
      }, {
        name: 'underscore',
        url: ''
      }, {
        name: 'RequireJS',
        url: ''
      }, {
        name: 'moment',
        url: ''
      }, {
        name: 'Ember-Data',
        url: ''
      }, {
        name: 'Handlebars',
        url: ''
      }, {
        name: 'HTMLbars',
        url: ''
      }, {
        name: 'Mustache',
        url: ''
      }]
    }, {
      title: 'Graphic Libraries',
      list: [{
        name: 'Bootstrap',
        url: ''
      }, {
        name: 'Chosen',
        url: ''
      }, {
        name: 'Select2',
        url: ''
      }]
    }, {
      title: 'Package Managers',
      list: [{
        name: 'npm',
        url: ''
      }, {
        name: 'Bower',
        url: ''
      }]
    }, {
      title: 'Testing',
      list: [{
        name: 'Jasmine',
        url: ''
      }, {
        name: 'Karma',
        url: ''
      }, {
        name: 'testem',
        url: ''
      }, {
        name: 'QUnit',
        url: ''
      }, {
        name: 'fakehr',
        url: ''
      }, {
        name: 'Js.Edgar',
        url: ''
      }]
    }, {
      title: 'Build Tools',
      list: [{
        name: 'Grunt',
        url: ''
      }, {
        name: 'Ember-CLI',
        url: ''
      }, {
        name: 'Broccoli',
        url: ''
      }]
    }, {
      title: 'Linting',
      list: [{
        name: 'ESLint',
        url: ''
      }, {
        name: 'JSHint',
        url: ''
      }, {
        name: 'JSLint',
        url: ''
      }]
    }];
  }
});
