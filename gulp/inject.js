'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var bowerFiles = require('main-bower-files');
var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('inject', ['scripts', 'styles'], function () {
    var injectStyles = gulp.src([
      options.tmp + '/serve/app/**/*.css',
      '!' + options.tmp + '/serve/app/vendor.css'
    ], { read: false });

    var injectScripts = gulp.src([
      options.tmp + '/serve/app/**/*.js',
      '!' + options.src + '/app/**/*.spec.js',
      '!' + options.src + '/app/**/*.mock.js'
    ], { read: false });

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    return gulp.src(options.src + '/*.html')
      // .pipe($.inject(injectStyles, injectOptions)) process at styles task
      // .pipe(wiredep(options.wiredep))
      .pipe($.inject(
        gulp.src(bowerFiles({
          paths: options.wiredep
        }), {read: false}), {
          relative: true,
          ignorePath: 'web',
          name: 'bower'
        }
      ))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(gulp.dest(options.tmp + '/serve'));
  });
};
