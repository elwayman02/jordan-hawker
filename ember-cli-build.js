/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function(defaults) {
    var app = new EmberApp({
        name: require('./package.json').name,
        getEnvJSON: require('./config/environment'),
        sassOptions: {
            includePaths: [
                'bower_components/bootstrap-sass-official/assets/stylesheets'
            ]
        }
    });

    var fontTree = pickFiles('bower_components/fontawesome/fonts', {
        srcDir: '/',
        files: ['*'],
        destDir: '/assets/fonts'
    });

    app.import('bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js');

    return mergeTrees([app.toTree(), fontTree]);
};
