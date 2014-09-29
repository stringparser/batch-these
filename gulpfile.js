'use strict';

var batchThese = require('./.');

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('js', function(cb){
  ;[
    'hello', 'world', 'what', 'up'
  ].forEach(function(data){
    batchThese(data, function(batch){
      console.log( '[' + this.module + '] \n P>', batch.join('\n P> ') );
    });
  });
  cb();
});
gulp.task('jsx', function(){ });
gulp.task('minify', function (){ });
gulp.task('test', function(){
  return gulp.src(['test/test.*.js'], { read: false })
  .pipe(mocha({
    reporter: 'spec',
    globals: {
      should: require('should')
    }
  }));
});

gulp.on('err', function(error){
  throw error.stack;
});

gulp.task('js:pipeline', ['jsx', 'js', 'minify']);
gulp.task('css:pipeline', function(){ });

gulp.task('default', ['js:pipeline','css:pipeline', 'test']);
