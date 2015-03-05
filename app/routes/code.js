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
        url: 'http://emberjs.com/',
        image: 'ember.png'
      }, {
        name: 'Backbone',
        url: 'http://backbonejs.org/',
        image: 'backbone.png'
      }]
    }, {
      title: 'Utility Libraries',
      list: [{
        name: 'jQuery',
        url: 'http://jquery.com/',
        image: 'jquery.png'
      }, {
        name: 'underscore',
        url: 'http://underscorejs.org/'
      }, {
        name: 'RequireJS',
        url: 'http://requirejs.org/',
        image: 'requirejs.svg'
      }, {
        name: 'moment',
        url: 'http://momentjs.com/',
        image: 'momentjs.png'
      }, {
        name: 'Ember-Data',
        url: 'http://emberjs.com/api/data/',
        image: 'ember.png'
      }, {
        name: 'Handlebars',
        url: 'http://handlebarsjs.com/',
        image: 'handlebars.png'
      }, {
        name: 'HTMLbars',
        url: 'https://github.com/tildeio/htmlbars'
      }, {
        name: 'Mustache',
        url: 'https://mustache.github.io/',
        image: 'mustache.png'
      }]
    }, {
      title: 'Graphic Libraries',
      list: [{
        name: 'Bootstrap',
        url: 'http://getbootstrap.com/',
        image: 'bootstrap.png'
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
        url: 'https://www.npmjs.com/',
        image: 'npm.png'
      }, {
        name: 'Bower',
        url: 'http://bower.io/',
        image: 'bower.png'
      }]
    }, {
      title: 'Testing',
      list: [{
        name: 'Jasmine',
        url: 'http://jasmine.github.io/',
        image: 'jasmine.png'
      }, {
        name: 'Karma',
        url: 'http://karma-runner.github.io/0.12/index.html',
        image: 'karma.png'
      }, {
        name: 'testem',
        url: 'https://github.com/airportyh/testem'
      }, {
        name: 'QUnit',
        url: 'http://qunitjs.com/',
        image: 'qunit.png'
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
        url: 'http://gruntjs.com/',
        image: 'grunt.png'
      }, {
        name: 'Ember-CLI',
        url: 'http://www.ember-cli.com/',
        image: 'ember-cli.png'
      }, {
        name: 'Broccoli',
        url: 'http://broccolijs.com/',
        image: 'broccoli.png'
      }]
    }, {
      title: 'Linting',
      list: [{
        name: 'ESLint',
        url: 'http://eslint.org/',
        image: 'eslint.svg'
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
