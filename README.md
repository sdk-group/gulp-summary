# gulp-summary
Summary is a tool for building index of processed files

##Usage

```javascript
var summary = require("gulp-summary");

gulp.task('doc',  function () {
    var summary_wd = './doc';
    gulp.src("./src/**/*.js")
        .pipe(gulp.dest(summary_wd + "/src"))
        .pipe(summary('index.md', {
            cwd: summary_wd
        }))
        .pipe(gulp.dest(summary_wd));

});
```

## Works great with [markdox](https://github.com/gberger/gulp-markdox)
[gulp-rename](https://github.com/hparra/gulp-rename) is also used
```javascript
var summary = require("gulp-summary");
var markdox = require("gulp-markdox");
var rename = require("gulp-rename");

gulp.task('doc',  function () {
    var summary_wd = './doc';
    gulp.src("./src/**/*.js",{read : false})
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

###Example gulpfile.js [here](./examples/gulpfile.js)
