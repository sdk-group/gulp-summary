var gulp = require('gulp')

var markdox = require("gulp-markdox");
var rename = require("gulp-rename");
var summary = require('../');
var watch = require('gulp-watch');
var del = require('del');
var plumber = require('gulp-plumber');
var batch = require('gulp-batch');
var Path = require('path');

//recreate all documents and build index
gulp.task('doc', ['clean-docs', 'create-docs'], function () {
    gulp.start('build-index');
});

gulp.task('create-docs', function () {
    return gulp.src("./src/**/*.js", {
            base: "./"
        })
        .pipe(markdox())
        .pipe(rename(function (path) {
            path.basename += "-doc";
            path.extname = ".md";
        }))
        .pipe(gulp.dest("./doc"));
});

gulp.task('build-index', function () {
    return gulp.src("./doc/**/*-doc.md", {
            read: false
        })
        .pipe(summary('index.md', {
            cwd: './doc'
        }))
        .pipe(gulp.dest('./doc'));
});

gulp.task('clean-docs', function (cb) {
    del.sync('./doc');
    cb();
});



gulp.task('watch-docs', function () {
    gulp.src("./src/**/*.js", {
            base: './'
        })
        .pipe(watch("./src/**/*.js"))
        .pipe(plumber())
        .pipe(markdox())
        .pipe(rename(function (path) {
            path.basename += "-doc";
            path.extname = ".md";
        }))
        .pipe(gulp.dest("./doc"))
        .pipe(summary('index.md', {
            cwd: './doc'
        }))
        .pipe(gulp.dest('./doc'));

    watch(("./src/**/*.js"), batch(function (events, cb) {
        events.on('data', function (file) {
            if ('unlink' === (file.event)) {
                var path = file.path;
                var base = file.base;
                var extname = Path.extname(path);
                var path_parts = {
                    dirname: Path.join('/doc', Path.dirname(path)),
                    basename: Path.basename(path, extname),
                };
                path = Path.join(path_parts.dirname, path_parts.basename + '-doc' + '.md');

                var abs_path = Path.join(file.base, path);
                del.sync(abs_path);
            }
            //unlinkDir event does not fire, dunno why
            /*else
            if ('unlinkDir' === (file.event)) {
                var path = Path.join('doc', file.path);
                console.log(path);
                path = Path.join(file.base, path);
                del.sync(path);
            }*/
        }).on('end', cb);
    }));
});