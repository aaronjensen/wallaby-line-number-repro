var path = require('path');
var createWebpackConfig = require('./createWebpackConfig');
var IgnoreFlycheckPlugin = require('./webpack/IgnoreFlycheckPlugin');

var config = createWebpackConfig({
  env: 'test',
  devtool: 'cheap-module-source-map',
  debug: true,
  suppressHtml: true,

  resolve: {
    alias: {
      google: path.resolve(__dirname, 'specs', 'stubs', 'google'),
      googleAnalytics: path.resolve(__dirname, 'specs', 'stubs', 'googleAnalytics'),
    },
  },

  devServer: {
    noInfo: false,
    stats: {
      hash: false,
      version: false,
      assets: false,
      modules: false,
      cached: false,
      timings: true,
      chunks: false,
      reasons: false,
      colors: true,
    },
    watchOptions: {
      aggregateTimeout: 50,
    },
  },

  plugins: [
    new IgnoreFlycheckPlugin(),
  ],
});

delete config.entry;
delete config.output;
delete config.externals;

module.exports = config;
