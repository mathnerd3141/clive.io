const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSequence = require('gulp-sequence').use(gulp);
const pump = require('pump');

const PATHS = {
  pugsrc: "src/views/**/*.pug",
  pugwatch: "src/views/**/*.{pug,html,md}",
  sass: "src/styles/**/*.{scss,sass}",
  ts: "src/scripts/**/*.ts",
  static: "static/**/*.*",
  dist: "dist"
};

function swallowError(e){
  console.error(e.toString());
  this.emit('end');
}

gulp.task('serve-dev', ['build'], function() {
  browserSync.init({
    serveStatic: ['./dist'],
    port: process.env.PORT || 3000,
    online: false,
    open: "local",
    logSnippet: false
  });

  gulp.watch(PATHS.ts, ['ts']);
  gulp.watch(PATHS.pugwatch, ['pug']);
  gulp.watch(PATHS.sass, ['sass']);
  gulp.watch(PATHS.static, ['static']);
});

gulp.task('build', gulpSequence(['ts', 'pug', 'static'], 'sass'));

gulp.task('ts', function(cb) {
  const ts = require('gulp-typescript');
  const uglify = require('gulp-uglify');
  const concat = require('gulp-concat');
  const es = require('event-stream');

  pump([
      gulp.src(PATHS.ts),
      ts({ module: 'none' }),
      concat('script.js'),
      uglify(),
      gulp.dest(PATHS.dist),
      browserSync.stream()
    ],
    cb
  );
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
