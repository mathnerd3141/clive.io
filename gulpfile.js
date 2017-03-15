var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var PATHS = {
  server: "src/server.coffee",
  pugsrc: "src/views/index.pug",
  pugwatch: "src/views/**/*.{pug,html,md}",
  sass: "src/styles/**/*.{scss,sass}",
  coffee: "src/scripts/**/*.coffee",
  js: "src/scripts/**/*.js",
  static: "static/**/*.*",
  dist: "./dist"
};

function swallowError(e){
  console.error(e.toString());
  this.emit('end');
}

gulp.task('serve', ['build'], function() {
  var nodemon = require('gulp-nodemon');

  nodemon({
    script: PATHS.server
  });

  browserSync.init({
    proxy: 'localhost:' + process.env.PORT,
    online: false
  });

  gulp.watch([PATHS.js, PATHS.coffee], ['js']);
  gulp.watch(PATHS.pugwatch, ['pug']);
  gulp.watch(PATHS.sass, ['sass']);
  gulp.watch(PATHS.static, ['static']);
});

gulp.task('build', ['js', 'pug', 'sass', 'static']);

gulp.task('js', function() {
  var coffee = require('gulp-coffee');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var es = require('event-stream');

  es.merge(
    gulp.src(PATHS.coffee)
      .pipe(coffee({bare: true}))
      .on('error', swallowError),
    gulp.src(PATHS.js)
  )
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
  var pug = require('gulp-pug');

  return gulp.src(PATHS.pugsrc)
    .pipe(pug())
    .on('error', swallowError)
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  var sass = require('gulp-sass');
  var sourcemaps = require('gulp-sourcemaps');
  var autoprefixer = require('gulp-autoprefixer');
  var concat = require('gulp-concat');

  return gulp.src(PATHS.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browserSync.stream());
});

gulp.task('static', function() {
  return gulp.src(PATHS.static)
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
