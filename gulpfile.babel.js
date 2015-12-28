'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var _ = require('lodash');

var container = 'app';
if(_.isString(process.argv[3]) && _.includes(process.argv[3], 'wechat')) {
  container = 'wechat';
}
console.log(`===== building for ${container} =====`);

var distMap = {
  app: 'cordova/www',
  wechat: 'wechat/www' // wechat support
};

var options = {
  container: container,
  src: 'web/src',
  dist: distMap[container],
  tmp: 'web/.tmp',
  e2e: 'web/e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    bowerJson: 'web/bower.json',
    bowerDirectory: 'web/bower_components',
    bowerrc: 'web/.bowerrc',
    directory: 'web/bower_components',
    exclude: [/jquery/]
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  if(/^mock/.test(file)) return false;
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});


var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');

gulp.task('sprites', function () {
  var spriteDir = options.src + '/assets/images/sprites';
  var spriteData = gulp.src(
      spriteDir + '/*.png'
    ).pipe(spritesmith({
      imgPath: '../assets/images/sprites.png',
      retinaImgPath: '../assets/images/sprites-2x.png',
      retinaImgName: 'sprites-2x.png',
      imgName: 'sprites.png',
      retinaSrcFilter: [spriteDir + '/*-2x.png'],
      cssName: 'sprites.scss'
  }));
  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    .pipe(gulp.dest(
      options.src + '/assets/images/'
    ));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest(
      options.src + '/app/'
    ));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});
