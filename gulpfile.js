const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSequence = require('gulp-sequence').use(gulp);

const PATHS = {
  pugsrc: "src/views/**/*.pug",
  pugwatch: "src/views/**/*.{pug,html,md}",
  sass: "src/styles/**/*.{scss,sass}",
  coffee: "src/scripts/**/*.coffee",
  js: "src/scripts/**/*.js",
  static: "static/**/*.*",
  dist: "dist"
};

function swallowError(e){
  console.error(e.toString());
  this.emit('end');
}

gulp.task('serve-dev', ['build'], function() {
  browserSync({
    serveStatic: ['./dist'],
    port: process.env.PORT || 3000,
    online: false,
    open: "local",
    logSnippet: false
  });

  gulp.watch([PATHS.js, PATHS.coffee], ['js']);
  gulp.watch(PATHS.pugwatch, ['pug']);
  gulp.watch(PATHS.sass, ['sass']);
  gulp.watch(PATHS.static, ['static']);
});

gulp.task('build', gulpSequence(['js', 'pug', 'static'], 'sass'));

gulp.task('js', function() {
  const coffee = require('gulp-coffee');
  const uglify = require('gulp-uglify');
  const concat = require('gulp-concat');
  const es = require('event-stream');

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
  const pug = require('gulp-pug');

  return gulp.src(PATHS.pugsrc)
    .pipe(pug())
    .on('error', swallowError)
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  const sass = require('gulp-sass');
  const autoprefixer = require('gulp-autoprefixer');
  const concat = require('gulp-concat');
  const purify = require('gulp-purifycss');
  const uglify = require('gulp-uglifycss');

  return gulp.src(PATHS.sass)
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(purify(['./dist/**.html', './dist/**.js']))
    .pipe(uglify())
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browserSync.stream());
});

gulp.task('static', function() {
  return gulp.src(PATHS.static)
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve-dev']);
