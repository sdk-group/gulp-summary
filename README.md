# gulp-summary
Summary is a tool for building index of processed files

###Example

```javascript
var summary = require('gulp-summary');

gulp.task('doc', ['clean-docs'], function () {
    var summary_wd = './doc';
    gulp.src("./src/**/*.js")
        .pipe(summary('index.md', {
            cwd: summary_wd
        }))
        .pipe(gulp.dest(summary_wd));

});
```