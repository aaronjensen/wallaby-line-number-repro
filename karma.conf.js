var webpackConfig = require('./webpack.karma.config.js');

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'specs/index.js'
    ],

    preprocessors: {
      'specs/index.js': ['webpack']
    },

    webpack: webpackConfig,
    webpackMiddleware: webpackConfig.devServer,

    // test results reporter to use
    // possible values: 'dots', 'progress', 'mocha'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // Switch to 'mocha' to see test names
    reporters: ['nyan'],

    // web server port
    port: 4200,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    usePolling: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    plugins: [
      require("karma-webpack-with-fast-source-maps"),
      require("karma-mocha"),
      require("karma-chai-plugins"),
      require("karma-phantomjs-launcher"),
      require("karma-nyan-reporter"),
      require("karma-teamcity-reporter"),
    ],
  });
};
