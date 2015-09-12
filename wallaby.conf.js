/*eslint-disable*/
var babel = require('babel');
var wallabyWebpack = require('wallaby-webpack');
var webpackConfig = require('./webpack.wallaby.config');
var path = require('path');

module.exports = function(wallaby) {
  // Wallaby copies files over, so any hard-coded paths we have must change
  webpackConfig.resolve.root = [
    path.join(wallaby.projectCacheDir, 'js'),
    wallaby.projectCacheDir,
  ];

  webpackConfig.entryPatterns = [
    'specs/**/*.spec.js',
    'specs/specHelper.js',
  ]

  var wallabyPostprocessor = wallabyWebpack(webpackConfig);
  var babelCompiler = wallaby.compilers.babel({ babel: babel, stage: 1 });

  return {
    files: [
      {pattern: 'node_modules/chai/chai.js', instrument: false},
      {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
      {pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false},
      {pattern: 'public/assets/static/**/*', instrument: false},

      {pattern: 'lib/**/*.js', load: false},
      {pattern: 'specs/specHelper.js', load: false},
      {pattern: 'specs/support/**/*.js', load: false},
    ],

    tests: [
      {pattern: 'specs/**/*.spec.js', load: false},
    ],

    compilers: {
      'js/**/*.js': babelCompiler,
      'specs/**/*.js': babelCompiler,
    },

    postprocessor: wallabyPostprocessor,

    env: {
      type: 'browser',
      runner: path.join(__dirname, 'node_modules/.bin/phantomjs'),
    },

    testFramework: 'mocha',

    bootstrap: function() {
      window.expect = chai.expect;
      window.__moduleBundler.loadTests();
    },
  };
}
