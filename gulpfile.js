const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSequence = require('gulp-sequence').use(gulp);
const pump = require('pump');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');

const PROD = !!process.env.PROD;

const PATHS = {
  pugsrc: "src/views/**/*.pug",
  pugwatch: "src/views/**/*.{pug,html,md}",
  sass: "src/styles/**/*.{scss,sass}",
  ts: "src/scripts/**/*.ts",
  static: "static/**/*.*",
  dist: "dist"
};

function swallowError(desc){
  return function(e){
    console.error("Error in " + desc + ":" + e.toString());
    if(!PROD)
      this.emit('end');
  }
}

const ts = require('gulp-typescript');
const Hjson = require('hjson');
const fs = require('fs');
const tsConfig = Hjson.parse(fs.readFileSync('./tsconfig.json').toString());
const tsProject = ts.createProject(tsConfig.compilerOptions);
gulp.task('ts', function(cb) {
  const uglify = require('gulp-uglify');
  const concat = require('gulp-concat');
  pump([
      gulp.src(PATHS.ts),
      gulpif(!PROD, sourceMaps.init()),
      tsProject(),
      concat('script.js'),
      uglify(),
      gulpif(!PROD, sourceMaps.write()),
      gulp.dest(PATHS.dist),
      gulpif(!PROD, browserSync.stream())
    ],
    cb
  )
  .on('error', swallowError('ts'));
});

gulp.task('pug', function() {
  const pug = require('gulp-pug');

  return gulp.src(PATHS.pugsrc)
    .pipe(pug())
    .on('error', swallowError('pug'))
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('cache-bust', function() {
  const cachebust = require('gulp-cache-bust');
  return gulp.src(PATHS.dist + '/**/*.html')
    .pipe(cachebust())
    .pipe(gulp.dest(PATHS.dist))
    .pipe(gulpif(!PROD, browserSync.stream()));
})

gulp.task('sass', function() {
  const sass = require('gulp-sass');
  const autoprefixer = require('gulp-autoprefixer');
  const concat = require('gulp-concat');
  const purify = require('gulp-purifycss');
  const uglify = require('gulp-uglifycss');

  return gulp.src(PATHS.sass)
    .pipe(gulpif(!PROD, sourceMaps.init()))
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(purify(['./dist/**.html', './dist/**.js']))
    .pipe(uglify())
    .pipe(gulpif(!PROD, sourceMaps.write()))
    .pipe(gulp.dest(PATHS.dist))
    .pipe(gulpif(!PROD, browserSync.stream()));
});

gulp.task('static', function() {
  return gulp.src(PATHS.static)
    .pipe(gulp.dest(PATHS.dist))
    .pipe(gulpif(!PROD, browserSync.stream()));
});

gulp.task('build', gulp.series(gulp.parallel('ts', 'pug', 'static'), 'sass', 'cache-bust'));

gulp.task('serve-dev', gulp.series('build', function() {
  browserSync.init({
    serveStatic: ['./dist'],
    port: process.env.PORT || 3000,
    online: false,
    open: "local",
    logSnippet: false
  });

  gulp.watch(PATHS.ts, function (event) {
    gulpSequence('ts', 'cache-bust')(function (err) {
      if (err) console.log(err)
    })
  });
  gulp.watch(PATHS.pugwatch, function (event) {
    gulpSequence('pug', 'cache-bust')(function (err) {
      if (err) console.log(err)
    })
  });
  gulp.watch(PATHS.sass, function (event) {
    gulpSequence('sass', 'cache-bust')(function (err) {
      if (err) console.log(err)
    })
  });
  gulp.watch(PATHS.static, function (event) {
    gulpSequence('static', 'cache-bust')(function (err) {
      if (err) console.log(err)
    })
  });
}));

gulp.task('default', gulp.series('serve-dev'));
