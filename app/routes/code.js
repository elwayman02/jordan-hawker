import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return [{
      title: 'Tech Sites',
      list: [{
        name: 'GitHub',
        url: 'http://bit.ly/JordanHawkerGH',
        icon: 'github'
      }, {
        name: 'StackOverflow',
        url: 'http://bit.ly/JordanHawkerSO',
        icon: 'stack-overflow'
      }]
    }, {
      title: 'Frameworks',
      list: [{
        name: 'Ember',
        url: 'http://emberjs.com/'
      }, {
        name: 'Backbone',
        url: 'http://backbonejs.org/'
      }]
    }, {
      title: 'Utility Libraries',
      list: [{
        name: 'jQuery',
        url: 'http://jquery.com/'
      }, {
        name: 'underscore',
        url: 'http://underscorejs.org/'
      }, {
        name: 'RequireJS',
        url: 'http://requirejs.org/'
      }, {
        name: 'moment',
        url: 'http://momentjs.com/'
      }, {
        name: 'Ember-Data',
        url: 'http://emberjs.com/api/data/'
      }, {
        name: 'Handlebars',
        url: 'http://handlebarsjs.com/'
      }, {
        name: 'HTMLbars',
        url: 'https://github.com/tildeio/htmlbars'
      }, {
        name: 'Mustache',
        url: 'https://mustache.github.io/'
      }]
    }, {
      title: 'Graphic Libraries',
      list: [{
        name: 'Bootstrap',
        url: 'http://getbootstrap.com/'
      }, {
        name: 'Chosen',
        url: 'http://harvesthq.github.io/chosen/'
      }, {
        name: 'Select2',
        url: 'https://select2.github.io/'
      }]
    }, {
      title: 'Package Managers',
      list: [{
        name: 'npm',
        url: 'https://www.npmjs.com/'
      }, {
        name: 'Bower',
        url: 'http://bower.io/'
      }]
    }, {
      title: 'Testing',
      list: [{
        name: 'Jasmine',
        url: 'http://jasmine.github.io/'
      }, {
        name: 'Karma',
        url: 'http://karma-runner.github.io/0.12/index.html'
      }, {
        name: 'testem',
        url: 'https://github.com/airportyh/testem'
      }, {
        name: 'QUnit',
        url: 'http://qunitjs.com/'
      }, {
        name: 'fakehr',
        url: 'https://github.com/trek/fakehr'
      }, {
        name: 'Js.Edgar',
        url: 'http://bit.ly/JsEdgar'
      }]
    }, {
      title: 'Build Tools',
      list: [{
        name: 'Grunt',
        url: 'http://gruntjs.com/'
      }, {
        name: 'Ember-CLI',
        url: 'http://www.ember-cli.com/'
      }, {
        name: 'Broccoli',
        url: 'http://broccolijs.com/'
      }]
    }, {
      title: 'Linting',
      list: [{
        name: 'ESLint',
        url: 'http://eslint.org/'
      }, {
        name: 'JSHint',
        url: 'http://jshint.com/'
      }, {
        name: 'JSLint',
        url: 'http://www.jslint.com/'
      }]
    }];
  }
});
