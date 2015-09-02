var path = require('path');
var webpack = require('webpack');
var merge = require('lodash/object/merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var HEAP_IDS = {
  development: 1041147718,
  edge: 2725009619,
  production: 1205457639,
  staging: 1349625450,
};

module.exports = function(additional) {
  additional = additional || {};

  var env = additional.env || 'production';
  delete additional.env;

  var suppressHtml = additional.suppressHtml;
  delete additional.suppressHtml;

  var jsLoaders = additional.additionalLoaders || [];
  delete additional.additionalLoaders;
  jsLoaders.push('babel?cacheDirectory');
  var deployEnv = process.env.DEPLOY_ENV || 'development';

  var htmlOptions = merge({},
    {
      enabled: true,
      deployEnv: deployEnv,
      heapId: HEAP_IDS[deployEnv]
    }, additional.html);
  delete additional.html;

  function concatArrays(a, b) {
    if (Array.isArray(a)) {
      return a.concat(b);
    }
  }

  function bower(filePath) {
    return path.join(__dirname, '.bower_components', filePath);
  }

  function vendor(filePath) {
    return path.join(__dirname, 'vendor/js', filePath);
  }

  var provides = {
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',

    // This is for Kalendae, which only looks for moment on window
    'window.moment': 'moment',
  };

  if (env === 'test') {
    merge(provides, {
      shallow: 'specs/support/shallow',
    });
  }

  var config = merge({
    entry: [
      './js/application.js',
    ],

    output: {
      path: path.join(__dirname, 'public'),
      filename: path.join('assets', 'js', 'application.js'),
      chunkFilename: path.join('assets', 'js', '[id].js'),
      sourceMapFilename: path.join('assets', 'js', '[file].map'),
      publicPath: '/',
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, 'js'),
            path.resolve(__dirname, 'specs'),
          ],
          loaders: jsLoaders,
        },
        { test: require.resolve("react"), loader: "expose?React" },
        { test: /basil.js$/, loader: 'exports?Basil' },
        { test: /ate.min.js$/, loader: 'script' },
        { test: /TweenMax.js$/, loader: 'exports?TweenMax' },
        { test: require.resolve('kalendae'), loader:'exports?window.Kalendae' },
        { test: require.resolve('svg4everybody/svg4everybody.min'), loader: 'script' }
      ]
    },

    externals: {
      'googleAnalytics': '__ga__',
      'google': 'google'
    },

    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: [
        path.resolve(__dirname, 'js'),
        __dirname
      ],
      alias: {
        react$: 'react/addons',
        requirejs: bower('requirejs/require.js'),
        jsxon: bower('jsxon/jsxon.amd.js'),
        async: bower('requirejs-plugins/src/async.js'),
        maps: bower('googlemaps-amd/src/googlemaps.js'),
        slider: bower('nouislider/distribute/jquery.nouislider.all.js'),
        uaParser: bower('ua-parser-js/dist/ua-parser.min.js'),
        TweenMax: bower('gsap/src/uncompressed/TweenMax.js'),
        fastclick: bower('fastclick/lib/fastclick.js'),
        pluralize: bower('pluralize/pluralize.js'),
        basil: bower('basil.js/src/basil.js'),
        flickity: bower('flickity/dist/flickity.pkgd.js'),
        ccTools: bower('cc_tools/cc_tools.js'),
        uuid: bower('node-uuid/uuid.js'),
        addthisevent: vendor('addthisevent/ate.min.js')
      },
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env),
        }
      }),
      new webpack.ProvidePlugin(provides),
    ]
  }, additional, concatArrays);

  if (!suppressHtml) {
    config.plugins.push(
      new HtmlWebpackPlugin(
        merge(
          {
            template: 'public/index_template.html',
            filename: 'index.html',
          },
          htmlOptions
        )
      )
    );
  }

  return config;
};
