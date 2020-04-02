const gulp = require('gulp')
const cache = require('gulp-cache')
const del = require('del')
const sass = require('gulp-sass')
const minifyHTML = require('gulp-htmlmin')
const minifyCSS = require('gulp-clean-css')
const minifyJS = require('gulp-terser')
const minifyJSON = require('gulp-jsonminify')

/* Files */
const src = 'src'
const srcSass = `${src}/style/sass`
const srcCss = `${src}/style/css`
const dist = 'dist'

/* Clean tasks */
gulp.task('clean', (resolve) => {
  del.sync(dist)
  resolve()
})

/* Sass Build task */
gulp.task('sass-build', () => gulp.src(`${srcSass}/*.sass`)
  .pipe(cache(sass()))
  .pipe(gulp.dest(srcCss)))

/* Script debug tasks */
gulp.task('scripts:debug', () => gulp.src(`${src}/js/**/*.js`)
  .pipe(gulp.dest(`${dist}/js`)))

/* Script production tasks */
gulp.task('scripts', () => gulp.src(`${src}/js/**/*.js`)
  .pipe(cache(minifyJS()))
  .pipe(gulp.dest(`${dist}/js`)))

gulp.task('maps', () => gulp.src(`${src}/js/**/*.map`)
  .pipe(gulp.dest(`${dist}/js`)))

/* Manifest debug tasks */
gulp.task('manifest:debug', () => gulp.src(`${src}/**/*.json`)
  .pipe(gulp.dest(dist)))

/* Manifest production tasks */
gulp.task('manifest', () => gulp.src(`${src}/**/*.json`)
  .pipe(cache(minifyJSON()))
  .pipe(gulp.dest(dist)))

/* Icon debug and production tasks */
gulp.task('icon', () => gulp.src(`${src}/**/*.png`)
  .pipe(gulp.dest(dist)))

/* Style debug tasks */
gulp.task('style:debug', () => gulp.src(`${srcCss}/**/*.css`)
  .pipe(gulp.dest(`${dist}/style/css`)))

/* Style production tasks */
gulp.task('style', () => gulp.src(`${srcCss}/**/*.css`)
  .pipe(cache(minifyCSS()))
  .pipe(gulp.dest(`${dist}/style/css`)))

/* Views debug tasks */
gulp.task('views:debug', () => gulp.src(`${src}/**/*.html`)
  .pipe(gulp.dest(dist)))

/* Views production tasks */
gulp.task('views', () => gulp.src(`${src}/**/*.html`)
  .pipe(cache(minifyHTML()))
  .pipe(gulp.dest(dist)))

/* Build tasks */
gulp.task('debug', gulp.series('clean', 'sass-build', gulp.parallel('scripts:debug', 'maps', 'manifest:debug', 'icon', 'style:debug', 'views:debug')))
gulp.task('build', gulp.series('clean', 'sass-build', gulp.parallel('scripts', 'maps', 'manifest', 'icon', 'style', 'views')))
