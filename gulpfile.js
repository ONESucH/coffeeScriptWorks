'use strict';
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    less = require('gulp-less'),
    postCss = require('gulp-postcss'),
    imagemin = require('gulp-imagemin'),
    sourceMaps = require('gulp-sourcemaps'),
    htmlmin = require('gulp-html-minifier'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    autoPrefix = require('autoprefixer');

gulp.task('connect', function () {
    browserSync.init({
        server: 'app/'
    });
    gulp.watch([
        'app/*.less',
        'app/scripts/**/*.js',
        'app/img/**/*.png',
        'app/main.html',
        'app/*.php'
    ], ['build']);
});

gulp.task('minJs', function () {
    gulp.src('app/scripts/main.js')
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('app/scripts'));
    gulp.src(['app/scripts/**/*.js', 'app/scripts/**/*.min.js', '!app/scripts/main.js'])
        .pipe(uglify())
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('minHtml', function () {
   gulp.src('app/main.html')
       .pipe(htmlmin({collapseWhitespace: true}))
       .pipe(rename('index.html'))
       .pipe(gulp.dest('app/'));
});

gulp.task('import', function () {
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
    gulp.src('app/scripts/**/*.*')
        .pipe(gulp.dest('build/scripts'));
    gulp.src(['app/vendor/**/*.css', 'app/vendor/**/*.min.css'])
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);}))
        .pipe(sourceMaps.init())
        .pipe(postCss([autoPrefix({browsers: ['last 10 versions']})]))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('build/vendor/'));
    gulp.src('app/vendor/**/*.*')
        .pipe(gulp.dest('build/vendor/'));
    gulp.src('app/*.html')
        .pipe(gulp.dest('build/'));
    gulp.src('app/*.css')
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);}))
        .pipe(sourceMaps.init())
        .pipe(postCss([autoPrefix({browsers: ['last 10 versions']})]))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('build/'));
    gulp.src('app/*.less')
        .pipe(gulp.dest('build/'));
    gulp.src('app/*.php')
        .pipe(gulp.dest('build/'));
    gulp.src('app/.htaccess')
        .pipe(gulp.dest('build/'));
});

gulp.task('reduce', function () {
   gulp.src('app/img/**/*.png')
       .pipe(imagemin())
       .pipe(gulp.dest('build/img/'));
});

gulp.task('build', function () {
    gulp.src('app/main.less')
        .pipe(less())
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);}))
        .pipe(sourceMaps.init())
        .pipe(postCss([autoPrefix({browsers: ['last 10 versions']})]))
        .pipe(sourceMaps.write('.'))
        .pipe(rename('_main.css'))
        .pipe(gulp.dest('app/'));
    browserSync.reload();
});

gulp.task('default', ['connect', 'build', 'minHtml', 'minJs']);