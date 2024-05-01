const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps'); // для отображения в среде разработки в каком файле находится класс
const groupMedia = require('gulp-group-css-media-queries'); // для удаления повторений в css. !!! глушит sourceMaps
const plumber = require('gulp-plumber'); // предотвращение зависаний
const notify = require('gulp-notify'); // предотвращение зависаний
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
// const changed = require('gulp-changed');
const sassGlob = require('gulp-sass-glob');

gulp.task('clean', function() {
  if(fs.existsSync('./dist/')){
    return gulp
      .src('./dist/', {read: false})
      .pipe(clean({force: true})) //удаление без вопросов
      .pipe(clean())
  }
  done();
})

gulp.task('html', function() {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    // .pipe(changed('./dist/'))
    .pipe(plumber(plumberConfig('HTML')))
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist/'))
})

const plumberConfig = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

gulp.task('sass', function() {
  return gulp
  .src('./src/scss/*.scss')
  // .pipe(changed('./dist/css'))
  .pipe(plumber(plumberConfig('SCSS')))
  .pipe(sourceMaps.init())
  .pipe(sassGlob())
  .pipe(sass())
  .pipe(groupMedia())
  .pipe(sourceMaps.write())
  .pipe(gulp.dest('./dist/css'))
})

gulp.task('img', function() {
  return gulp
  .src('./src/images/**/*', { encoding: false })
  // .pipe(changed('./dist/images'))
  .pipe(imagemin({ verbose: true })) // сжатие картинок
  .pipe(gulp.dest('./dist/images'))
})

gulp.task('fonts', function() {
  if(fs.existsSync('./src/fonts/')) {
    return gulp
    .src('./src/fonts/**/*', { encoding: false })
    // .pipe(changed('./dist/fonts'))
    .pipe(gulp.dest('./dist/fonts'))
  }
  done();
})

gulp.task('files', function() {
  if(fs.existsSync('./src/files/')) {
    return gulp
    .src('./src/files/**/*', { encoding: false })
    // .pipe(changed('./dist/files'))
    .pipe(gulp.dest('./dist/files'))
  }
  done();
})

gulp.task('js', function() {
  return gulp
    .src('./src/scripts/*.js')
    // .pipe(changed('./dist/scripts'))
    .pipe(plumber(plumberConfig('JS')))
    .pipe(babel())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('server', function() {
  return gulp.src('./dist/')
  .pipe(server({
    livereload: true,
    open: true
  }))
})

gulp.task('watch', function() {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('./src/**/*.html', gulp.parallel('html'));
  gulp.watch('./src/images/**/*', gulp.parallel('img'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
  gulp.watch('./src/files/**/*', gulp.parallel('files'));
  gulp.watch('./src/scripts/**/*', gulp.parallel('js'));
})

gulp.task('default',
  gulp.series('clean',
  gulp.parallel('html', 'sass', 'img', 'fonts', 'files', 'js'),
  gulp.parallel('server', 'watch')
))
