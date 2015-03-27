# gulp-summary
Summary is a tool for building index of processed files

###Example

```javascript
var summary = require("gulp-summary");
var markdox = require("gulp-markdox");
var rename = require("gulp-rename");

gulp.task('doc',  function () {
    var summary_wd = './doc';
    gulp.src("./src/**/*.js")
        .pipe(markdox())
        .pipe(rename(function (path) {
            path.basename += "-doc";
            path.extname = ".md";
        }))
        .pipe(gulp.dest(summary_wd + "/src"))
        .pipe(summary('index.md', {
            cwd: summary_wd
        }))
        .pipe(gulp.dest(summary_wd));

});
```