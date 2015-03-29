var gulp = require('gulp')

var markdox = require("gulp-markdox");
var rename = require("gulp-rename");
var summary = require('gulp-summary');
var del = require('del');

gulp.task('doc', ['clean-docs'], function () {
    gulp.src("./src/**/*.js", {
            base: './'
        })
        .pipe(markdox())
        .pipe(rename(function (path) {
            path.basename += "-doc";
            path.extname = ".md";
        }))
        .pipe(gulp.dest("./doc"))
        .pipe(summary('index.md', {
            cwd: summary_wd
        }))
        .pipe(gulp.dest("./doc"));

});


gulp.task('clean-docs', function (cb) {
    del('./doc', cb);
});