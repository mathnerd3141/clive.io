var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var nodemon = require('gulp-nodemon');
var coffee = require('gulp-coffee');
var pug = require('gulp-pug');
var sass = require('gulp-sass');

var PATHS = {
  server: "src/server.coffee",
  pug: "src/views/**/*.pug",
  sass: "src/styles/**/*.{scss,sass}",
  coffee: "src/scripts/**/*.coffee",
  static: "static/**/*.*"
};

gulp.task('serve', ['build'], function() {
  var PORT = argv.port;
  console.log(argv.port);
  if(typeof PORT !== "number" || Math.floor(PORT) !== PORT){
    console.error('You need to supply a valid port like --port=12345.');
    process.exit(1);
  }else try{
    nodemon({
      script: PATHS.server, 
      args: [PORT.toString()]
    });

    browserSync.init({
      proxy: 'localhost:' + PORT,
      online: false
    });

    gulp.watch(PATHS.coffee, ['coffee']);
    gulp.watch(PATHS.pug, ['pug']);
    gulp.watch(PATHS.sass, ['sass']);
    gulp.watch(PATHS.static, ['static']);
  }catch(e){
    console.log(e);
  }
});

gulp.task('build', ['coffee', 'pug', 'sass', 'static']);

gulp.task('coffee', function() {
  gulp.src(PATHS.coffee)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
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
