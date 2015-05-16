/*globals blanket, module */

var options = {
  modulePrefix: "jordan-hawker",
  filter: "//.*jordan-hawker/.*/",
  antifilter: "//.*(tests|template).*/",
  loaderExclusions: [],
  enableCoverage: true,
  cliOptions: {
    lcovOptions: {
      outputFile: 'lcov.dat'
    },
    reporters: ['lcov']
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}
