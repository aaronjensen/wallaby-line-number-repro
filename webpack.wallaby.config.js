var path = require('path');
var createWebpackConfig = require('./createWebpackConfig');

var config = createWebpackConfig({
  env: 'test',
  suppressHtml: true,

  resolve: {
    alias: {
      google: path.resolve(__dirname, 'specs', 'stubs', 'google'),
      googleAnalytics: path.resolve(__dirname, 'specs', 'stubs', 'googleAnalytics'),
    },
  },

  resolveLoader: {
    alias: {
      bundle: path.resolve(__dirname, 'specs', 'stubs', 'fakeBundleLoader'),
    },
  },

  module: {
    noParse: [
      /sinon\.js$/,
      /chai\.js$/,
    ],
  },
});

delete config.entry;
delete config.output;
delete config.externals;
config.module.loaders.shift();

module.exports = config;
