var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var pug = require('gulp-pug');
var sass = require('gulp-sass');

var PATHS = {
  pug: "src/pug/**/*.pug",
  sass: "src/scss/**/*.{scss,sass}",
  static: "static/**/*.*"
};

var PORT = 10203;

gulp.task('serve', ['nodemon', 'build'], function() {
  browserSync.init({
    proxy: 'localhost:' + PORT
  });

  gulp.watch(PATHS.pug, ['pug']);
  gulp.watch(PATHS.sass, ['sass']);
  gulp.watch(PATHS.static, ['static']);
});

gulp.task('build', ['pug', 'sass', 'static']);

gulp.task('nodemon', function() {
  nodemon({
    script: './src/server.coffee', 
    args: [PORT.toString()]
  });
});

gulp.task('pug', function() {
  return gulp.src(PATHS.pug)
    .pipe(pug())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  return gulp.src(PATHS.sass)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('static', function() {
  return gulp.src(PATHS.static)
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
