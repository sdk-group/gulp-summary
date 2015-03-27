var gulp = require('gulp')

var markdox = require("gulp-markdox");
var rename = require("gulp-rename");
var summary = require('gulp-summary');
var rimraf = require('rimraf');

gulp.task('doc', function () {
    gulp.src("./src/**/*.js")
        .pipe(markdox())
        .pipe(rename(function (path) {
            path.basename += "-doc";
            path.extname = ".md";
        }))
        .pipe(gulp.dest("./doc/src"))
        .pipe(summary('index.md'))
        .pipe(gulp.dest("./doc"));

});


gulp.task('clean-docs', function (cb) {
    rimraf('./doc', cb);
});