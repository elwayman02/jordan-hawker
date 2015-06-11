/*globals blanket, module */

var options = {
    modulePrefix: "jordan-hawker",
    filter: "//.*jordan-hawker/.*/",
    antifilter: "//.*(tests|template).*/",
    loaderExclusions: [],
    enableCoverage: true,
    cliOptions: {
        lcovOptions: {
            outputFile: 'lcov.dat',
            renamer: function (moduleName) {
                var expression = /^jordan-hawker/;
                var name = moduleName.replace(/^jordan-hawker\/config/, 'config');
                return name.replace(expression, 'app') + '.js';
            }
        },
        reporters: ['lcov']
    }
};
if (typeof exports === 'undefined') {
    blanket.options(options);
} else {
    module.exports = options;
}
