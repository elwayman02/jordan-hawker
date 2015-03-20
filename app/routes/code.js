import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return [{
      title: 'Public Projects',
      list: [{
        name: 'Js.Edgar',
        url: 'http://bit.ly/JsEdgar',
        description: 'A lightweight spy/mock library for JavaScript, Js.Edgar is framework-agnostic and built to provide easy-to-use APIs and exactly what you need to test your application without unnecessary bloat'
      }, {
        name: 'Ember Bug Widget',
        url: 'https://github.com/elwayman02/ember-bug-widget',
        description: 'A configurable addon for inserting a simple bug-reporting widget into any EmberJS application'
      }, {
        name: 'ChilloutMusic v2.0',
        url: 'https://github.com/ChilloutMusic/website',
        description: 'The redesigned website for ChilloutMusic.fm, a plug.dj community'
      }, {
        name: 'JordanHawker.com',
        url: 'https://github.com/elwayman02/jordan-hawker',
        description: 'My personal and professional website'
      }]
    }, {
      title: 'Publications',
      list: [{
        name: 'Using SQlite (Reviewer)',
        url: 'http://bit.ly/JordanHawkerSQLite',
        description: 'Written by Jay A. Kreibich and published by O\'Reilly Media Inc, Using SQlite is an introduction to the SQlite database product.  I had the distinct pleasure of being a technical reviewer for the book.'
      }, {
        name: 'queryCategorizr (Co-Author)',
        url: 'http://bit.ly/queryCategorizr',
        description: 'The full title is "queryCategorizr: A Large-Scale Semi-Supervised System for Categorization of Web Search Queries". This paper was co-written with several talented colleagues at Yahoo: Mihajlo Grbovic, Nemanja Djuric, Vladan Radosavljevic, Narayan Bhamidipati, and Caleb Johnson. We submitted and were accepted to present the paper at the 24th International World Wide Web Conference in 2015.'
      }]
    }, {
      title: 'Tech Profiles',
      list: [{
        name: 'GitHub',
        url: 'http://bit.ly/JordanHawkerGH',
        icon: 'github',
        description: 'The world\'s largest code-hosting site'
      }, {
        name: 'StackOverflow',
        url: 'http://bit.ly/JordanHawkerSO',
        icon: 'stack-overflow',
        description: 'The world\'s largest programming help community'
      }]
    }, {
      title: 'Frameworks',
      list: [{
        name: 'Ember',
        url: 'http://emberjs.com/',
        image: 'ember.png',
        description: 'A framework for creating ambitious web applications'
      }, {
        name: 'Backbone',
        url: 'http://backbonejs.org/',
        image: 'backbone.png',
        description: 'A toolset for providing structured web applications with key-value binding, enumerable collections, and declarative event handling on top of a RESTful JSON interface'
      }]
    }, {
      title: 'Utility Libraries',
      list: [{
        name: 'jQuery',
        url: 'http://jquery.com/',
        image: 'jquery.png',
        description: 'A feature-rich JavaScript library that simplifies DOM manipulation, event handling, animation, AJAX, and more'
      }, {
        name: 'underscore',
        url: 'http://underscorejs.org/',
        description: 'A JavaScript utility-belt that provides useful functional programming helpers, function binding, templating, and more'
      }, {
        name: 'RequireJS',
        url: 'http://requirejs.org/',
        image: 'requirejs.svg',
        description: 'A JavaScript file and module loader'
      }, {
        name: 'moment',
        url: 'http://momentjs.com/',
        image: 'momentjs.png',
        description: 'A lightweight library for parsing, validating, manipulating, and formatting dates'
      }, {
        name: 'Ember-Data',
        url: 'https://github.com/emberjs/data',
        image: 'ember.png',
        description: 'A library for robustly managing model data in Ember.js applications'
      }, {
        name: 'Handlebars',
        url: 'http://handlebarsjs.com/',
        image: 'handlebars.png',
        description: 'A semantic web templating system, built as a superset of Mustache'
      }, {
        name: 'HTMLbars',
        url: 'https://github.com/tildeio/htmlbars',
        description: 'A handlebars variant that compiles templates into DOM nodes instead of HTML-unaware strings'
      }, {
        name: 'Mustache',
        url: 'https://mustache.github.io/',
        image: 'mustache.png',
        description: 'A framework-agnostic logic-less templating system'
      }]
    }, {
      title: 'Graphic Libraries',
      list: [{
        name: 'Bootstrap',
        url: 'http://getbootstrap.com/',
        image: 'bootstrap.png',
        description: 'A mobile first front-end graphics & design library'
      }, {
        name: 'Chosen',
        url: 'http://harvesthq.github.io/chosen/',
        description: 'A jQuery plugin for user-friendly select boxes'
      }, {
        name: 'Select2',
        url: 'https://select2.github.io/',
        description: 'A jQuery plugin providing a customizable select box with support for searching, tagging, remote data sets, infinite scrolling, and many other highly used options'
      }]
    }, {
      title: 'Package Managers',
      list: [{
        name: 'npm',
        url: 'https://www.npmjs.com/',
        image: 'npm.png',
        description: 'A package manager for JavaScript and Node.js'
      }, {
        name: 'Bower',
        url: 'http://bower.io/',
        image: 'bower.png',
        description: 'A JavaScript package manager for git and GitHub repositories'
      }]
    }, {
      title: 'Testing',
      list: [{
        name: 'Jasmine',
        url: 'http://jasmine.github.io/',
        image: 'jasmine.png',
        description: 'A behavior-driven development framework for testing JavaScript code'
      }, {
        name: 'Karma',
        url: 'http://karma-runner.github.io/0.12/index.html',
        image: 'karma.png',
        description: 'A framework-agnostic tool for executing JavaSCript tests across multiple browsers'
      }, {
        name: 'testem',
        url: 'https://github.com/airportyh/testem',
        description: 'A framework-agnostic JavaScript test runner'
      }, {
        name: 'QUnit',
        url: 'http://qunitjs.com/',
        image: 'qunit.png',
        description: 'A powerful JavaScript unit testing framework'
      }, {
        name: 'fakehr',
        url: 'https://github.com/trek/fakehr',
        description: 'A framework-agnostic XHR request interceptor for tests'
      }, {
        name: 'Js.Edgar',
        url: 'http://bit.ly/JsEdgar',
        description: 'A lightweight spy/mock library for JavaScript, Js.Edgar is framework-agnostic and built to provide easy-to-use APIs and exactly what you need to test your application without unnecessary bloat'
      }]
    }, {
      title: 'Build Tools',
      list: [{
        name: 'Grunt',
        url: 'http://gruntjs.com/',
        image: 'grunt.png',
        description: 'A JavaScript task runner'
      }, {
        name: 'Ember-CLI',
        url: 'http://www.ember-cli.com/',
        image: 'ember-cli.png',
        description: 'A command line interface for ambitious web applications'
      }, {
        name: 'Broccoli',
        url: 'http://broccolijs.com/',
        image: 'broccoli.png',
        description: 'An asset pipeline for ambitious applications'
      }]
    }, {
      title: 'Linting',
      list: [{
        name: 'ESLint',
        url: 'http://eslint.org/',
        image: 'eslint.svg',
        description: 'A pluggable linting utility for JavaScript'
      }, {
        name: 'JSHint',
        url: 'http://jshint.com/',
        description: 'An open-source code quality tool for JavaScript'
      }, {
        name: 'JSLint',
        url: 'http://www.jslint.com/',
        description: 'A JavaScript syntax checker and validator'
      }]
    }];
  }
});
