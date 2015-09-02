var path = require('path');
var glob = require('glob');
var fs = require('fs');
var spawn = require('child_process').spawn;

var styleGlob = 'assets/stylesheets/**/*.sass';
var svgGlob = 'assets/svg/*.svg';

var exec = require("child_process").exec;
var webpackDistConfig = require('./webpack.dist.config.js');
webpackDistConfig.progress = false;
var distSrcPath = 'dist/DEV';

module.exports = function(grunt){
  grunt.initConfig({
    eslint: {
      target: '.',
      options: {
        quiet: true,
      },
    },
    watch: {
      options: {
        spawn: false,
      },
      style: {
        files: [styleGlob],
        tasks: ['sass', 'autoprefixer'],
      },
      svg: {
        files: [svgGlob],
        tasks: ['svgstore'],
      },
    },
    karma: {
      ci: {
        background: false,
        configFile: 'karma.conf.js',
        singleRun: true,
        reporters: ['teamcity']
      }
    },
    sass: {
      dist: {
        options: {
          includePaths: ['.bower_components/susy/sass', 'assets/stylesheets']
        },
        files: [{
          expand: true,
          cwd: 'assets/stylesheets/',
          src: ['application.sass'],
          dest: 'public/assets/css',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      dist: {
        files: {
          'public/assets/css/application.css': 'public/assets/css/application.css'
        }
      }
    },
    browserSync: {
      bsFiles: {
        src : 'public/assets/css/application.css'
      },
      options: {
        port: 4000,
        proxy: 'localhost:4001',
        open: false,
        watchTask: true,
        ui: {
          port: 4002,
        },
      }
    },
    copy: {
      images: {
        files: [
          {
            expand: true,
            cwd: 'assets/images/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'public/assets/images/'
          }
        ]
      },
      svg: {
        files: [
          {
            expand: true,
            cwd: 'assets/svg/',
            src: ['**/*.svg'],
            dest: 'public/assets/svg/'
          }
        ]
      }
    },
    svgstore: {
      options: {
        prefix : 'icon-',
        svg: {
          viewBox : '0 0 30 30',
          xmlns: 'http://www.w3.org/2000/svg'
        },
        formatting : {
          indent_size : 2
        },
        includedemo: true
      },
      default: {
        files: {
          'public/assets/svg/svg-sprite.svg': [svgGlob],
        }
      }
    },
    webpack: {
      dist: webpackDistConfig,
    },
    teamcity: {
      all: {},
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-teamcity');

  grunt.registerTask('ci', [
    'teamcity',
    'eslint',
    'karma:ci',
  ]);

  grunt.registerTask('deploy',
    [
      'sass',
      'copy',
      'autoprefixer',
      'svgstore',
      'set-env-configurations',
      'set-dist-folder',
      'webpack:dist',
      'bust-it'
    ]
  );

  var defaultTasks = [
    'sass',
    'copy',
    'autoprefixer',
    'svgstore',
    'browserSync',
    'spawn-karma',
    'spawn-webpack-dev-server',
    'watch'
  ];

  grunt.registerTask('default', defaultTasks);

  function notKarma(task) { return !task.includes('karma'); }
  grunt.registerTask('no-karma', defaultTasks.filter(notKarma));

  grunt.registerTask('spawn-karma', function() {
    spawn('node_modules/.bin/karma', ['start'], {stdio: 'inherit'});
  });

  grunt.registerTask('spawn-webpack-dev-server', function() {
    spawn('node_modules/.bin/webpack-dev-server', ['--config', 'webpack.hot.config.js'], {stdio: 'inherit'});
  });

  grunt.registerTask('bust-it', function(){
    var done = this.async();
    var distFolder = path.join('public', distSrcPath);

    exec('mkdir -p ' + distFolder, function(err){
      if(err) { grunt.fail.fatal(err); }

      exec("cp -rvL public/assets " + distFolder, function(err){
        if(err) { grunt.fail.fatal(err); }
        var files = glob.sync(distFolder+'/assets/**/*.*');
        var sedCommand = "sed -i 's|/assets/|/"+distSrcPath+"/assets/|g' " + files.join(' ');
        exec(sedCommand, function(err){
          if(err) { grunt.fail.fatal(err); }
          grunt.log.ok('created: ' + distSrcPath);
          done();
        });
      });
    });
  });

  grunt.registerTask('set-env-configurations', function(){
    var env = grunt.option('env') || 'development';
    var done = this.async();
    exec("cp -v --remove-destination ./configuration/"+env+"/configuration.js ./js/", function(error, stdout) {
      if(error) { grunt.fail.fatal(error); }
      grunt.log.write('Setting configuration...');
      grunt.log.ok(stdout);
      done();
    });
  });

  grunt.registerTask('set-dist-folder', function() {
    var rev = fs.readFileSync('REVISION', {encoding: 'utf8'}).trim();
    distSrcPath = path.join('dist', rev);

    webpackDistConfig.output.filename = path.join(distSrcPath, 'application.js');
    webpackDistConfig.output.chunkFilename = path.join(distSrcPath, '[id].js');
    webpackDistConfig.output.sourceMapFilename = path.join(distSrcPath, '[file].map');
  });
};
