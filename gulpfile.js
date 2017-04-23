'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var argv = require('yargs').argv;
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var util = require('gulp-util');

const DESTINY = './';
const APP_PATH = `${DESTINY}app/`;
const cssPath = `${DESTINY}css`;

var CONFIG_PATH;
var jsWatcher;


function instanceBuilder(environment) {
    let indexPath = './config/index.html';
    CONFIG_PATH = `./config/${environment}/`;
    if (environment === 'localhost') {
        indexPath = `${CONFIG_PATH}index.html`;
    }
    console.log(indexPath);
    gulp
        .src(indexPath)
        .pipe(gulp.dest(DESTINY))
    gulp
        .src(`${CONFIG_PATH}tombola.config.json`)
        .pipe(gulp.dest(DESTINY))

    if (argv.hasOwnProperty("watch")) {
        jsWatcher = gulp.watch([`${APP_PATH}**/*.js`], ['scripts']);
        jsWatcher.on('change', onChange);
    }

    if (argv.hasOwnProperty("watch")) {
        var changer = gulp.watch(['!' + cssPath, cssPath + '/tombola*.less'], ['styles']);
        changer.on('change', onChange);
    }
}


var onChange = function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', executing tasks...');
};

gulp.task('delete-files', function () {
    return del([
        DESTINY + 'index.html',
        DESTINY + 'tombola.config.json',
        DESTINY + 'js/app.all.js'
    ])
});

gulp.task('styles', function() {
    gulp.src(['!' + cssPath, cssPath + '/tombola*.less'])
        .pipe(less().on('error', util.log))
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + (details.stats.originalSize / 1000).toFixed(2) + ' Kb, reducido a ' +
                (details.stats.minifiedSize / 1000).toFixed(2) + ' Kb, ' +
                ((details.stats.efficiency * 100).toFixed(2)) + '% de eficiencia');
        }))
        .pipe(gulp.dest(cssPath));
});

gulp.task('scripts', function () {
    gulp.src([APP_PATH + '**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.all.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${DESTINY}js/`))
});

gulp.task('default', ['styles','delete-files'], function () {
    instanceBuilder('localhost');
});

gulp.task('production', ['styles','scripts'], function () {
    instanceBuilder('production');
});
