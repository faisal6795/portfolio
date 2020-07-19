'use strict';

var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');

// Gulp task to minify CSS files
gulp.task('styles', () => gulp.src('./css/*.css').pipe(csso()).pipe(gulp.dest('./release/css')));

// Gulp task to minify JavaScript files
gulp.task('scripts', () => gulp.src('./js/*.js').pipe(uglify()).pipe(gulp.dest('./release/js')));

// Gulp task to minify HTML fiels
gulp.task('pages', () => gulp.src(['*.html'])
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('./release'))
);

// Clean output directory
gulp.task('clean', () => del(['release']));

// Gulp task to minify all files
gulp.task('default', gulp.series('clean', 'styles', 'scripts', 'pages'));