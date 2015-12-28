'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var _ = require('lodash');

module.exports = function(options) {
  function webpack(watch, callback) {
    var webpackOptions = {
      watch: watch,
      module: {
        // preLoaders: [{ test: /\.js$/, include: /app/, loader: 'jshint-loader'}],
        loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}]
      },
      output: { filename: 'index.js' }
    };

    if(watch) {
      webpackOptions.devtool = 'inline-source-map';
    }

    var webpackChangeHandler = function(err, stats) {
      if(err) {
        options.errorHandler('Webpack')(err);
      }
      $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: false
      }));
      browserSync.reload();
      if(watch) {
        watch = false;
        callback();
      }
    };

    return gulp.src(options.src + '/app/index-es6.js')
      .pipe($.webpack(webpackOptions, null, webpackChangeHandler))
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  }

  gulp.task('injectES6', function() {
    var injectFiles = gulp.src([
      options.src + '/app/*/**/*.js'
    ], { read: false });

    var componentName, componentType;
    var injectOptions = {
      transform: function(filePath) {
        console.log(filePath);
        filePath = filePath.replace(options.src + '/app/', '').replace('.js', '');
        if(filePath.includes('components')) {
          componentName = _.last(filePath.split('/'));
          if(filePath.includes('directives')) {
            componentType = 'directive';
          }
          if(filePath.includes('filters')) {
            componentType = 'filter';
          }
          if(filePath.includes('services')) {
            componentType = 'factory';
          }
        } else {
          componentType = 'controller';
          componentName = _.camelCase(filePath) + 'Ctrl';
        }
        return `
          import ${componentName} from './${filePath}';
          App.${componentType}('${componentName}', ${componentName});
        `.split('\n').map(_.trim).join('\n');
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    return gulp.src(options.src + '/app/index.js')
      .pipe($.inject(injectFiles, injectOptions))
      .pipe($.rename('index-es6.js'))
      .pipe(gulp.dest(options.src + '/app/'));
  });

  gulp.task('scripts', ['injectES6'], function () {
    return webpack(false);
  });

  gulp.task('scripts:watch', ['scripts'], function (callback) {
    return webpack(true, callback);
  });
};
