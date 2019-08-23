const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');
const sourceMaps = require('gulp-sourcemaps');

const PROD = !!process.env.PROD;

const PATHS = {
  pugsrc: "src/views/**/*.pug",
  pugwatch: "src/views/**/*.{pug,html,md}",
  sass: "src/styles/**/*.{scss,sass}",
  ts: "src/scripts/**/*.ts",
  static: "static/**/*.*",
  dist: "dist",
  build: "build"
};

gulp.task('ts', function() {
  const concat = require('gulp-concat');
  const sourceMaps = require('gulp-sourcemaps');
  const ts = require('gulp-typescript');
  const Hjson = require('hjson');
  const fs = require('fs');
  const tsConfig = Hjson.parse(fs.readFileSync('./tsconfig.json').toString());
  const tsProject = ts.createProject(tsConfig.compilerOptions);

  return gulp.src(PATHS.ts)
    .pipe(gulpif(!PROD, sourceMaps.init()))
    .pipe(tsProject())
    .pipe(concat('script.js'))
    .pipe(gulpif(!PROD, sourceMaps.write()))
    .pipe(gulp.dest(PATHS.build));
});

gulp.task('pug', function() {
  const pug = require('gulp-pug');

  return gulp.src(PATHS.pugsrc)
    .pipe(pug())
    .pipe(gulp.dest(PATHS.build))
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('cache-bust', function() {
  const cachebust = require('gulp-cache-bust');
  return gulp.src(PATHS.dist + '/**/*.html')
    .pipe(cachebust())
    .pipe(gulp.dest(PATHS.dist))
    .pipe(gulpif(!PROD, browserSync.stream({once: true})));
});

gulp.task('sass', function() {
  const sass = require('gulp-sass');
  const autoprefixer = require('gulp-autoprefixer');
  const concat = require('gulp-concat');

  return gulp.src(PATHS.sass)
    .pipe(gulpif(!PROD, sourceMaps.init()))
    .pipe(sass({outputStyle:'compressed'}))
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(gulpif(!PROD, sourceMaps.write()))
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('purifycss', function() {
  const purify = require('gulp-purifycss');
  const uglify = require('gulp-uglifycss');

  return gulp.src(PATHS.dist + '/style.css')
    .pipe(gulpif(!PROD, sourceMaps.init({loadMaps: true})))
    .pipe(purify(['./build/**.html', './dist/**.js']))
    .pipe(uglify())
    .pipe(gulpif(!PROD, sourceMaps.write()))
    .pipe(gulp.dest(PATHS.dist))
    .pipe(gulpif(!PROD, browserSync.stream({once: true})));
});

gulp.task('uglifyjs', function(){
  const uglify = require('gulp-uglify');
  return gulp.src(PATHS.build + '/script.js')
      .pipe(gulpif(!PROD, sourceMaps.init({loadMaps: true})))
      .pipe(uglify())
      .pipe(gulpif(!PROD, sourceMaps.write()))
      .pipe(gulp.dest(PATHS.dist))
      .pipe(gulpif(!PROD, browserSync.stream({once: true})));
});

gulp.task('static', function() {
  return gulp.src(PATHS.static)
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('build', gulp.series(
  gulp.parallel('ts', 'pug', 'static', 'sass'),
  gulp.parallel('purifycss', 'cache-bust', 'uglifyjs')
));

gulp.task('serve-dev', gulp.series('build', function() {
  browserSync.init({
    serveStatic: ['./dist'],
    port: process.env.PORT || 3000,
    online: false,
    open: "local",
    logSnippet: false
  });

  gulp.watch(PATHS.ts, gulp.series('ts', gulp.parallel('purifycss', 'cache-bust', 'uglifyjs')));
  gulp.watch(PATHS.pugwatch, gulp.series('pug', gulp.parallel('purifycss', 'cache-bust')));
  gulp.watch(PATHS.sass, gulp.series('sass', gulp.parallel('purifycss', 'cache-bust')));
  gulp.watch(PATHS.static, gulp.series('static', gulp.parallel('purifycss', 'cache-bust')));
}));

gulp.task('clean', function() {
  const del = require('del');
  return del([
    'dist',
    'build'
  ]);
});

gulp.task('default', gulp.series('serve-dev'));
