var gutil = require("gulp-util");
var through = require("through2");
var path = require('path');
var util = require('util');

gulpError = function (message) {
    return new gutil.PluginError('gulp-indexmaker', message)
}

String.prototype.repeat = function (n) {
    n = n || 1;
    return Array(n).join(this);
}

module.exports = function (file, options) {
    "use strict";
    if (!file) {
        throw new gutil.PluginError('gulp-indexmaker', 'Missing file option for gulp-indexmaker');
    }

    if (!options || typeof options !== 'object') {
        options = {};
    }

    var firstFile;
    var concat = {};

    function makeIndex(file, enc, callback) {

        if (file.isNull()) {
            callback();
            return;
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-concat', 'Streaming not supported'));
            callback();
            return;
        }


        // set first file if not already set
        if (!firstFile) {
            firstFile = file;
        }

        var filename = path.relative(process.cwd(), file.path);
        var path_parts = filename.split("\\");
        var leaf = concat;

        for (var i = 0; i < path_parts.length; i += 1) {
            var part = path_parts[i];

            if (i !== (path_parts.length - 1)) {
                if (!leaf.hasOwnProperty(part)) {
                    leaf[part] = {};
                }
                leaf = leaf[part];
            } else {
                if (!leaf.hasOwnProperty('$files')) {
                    leaf['$files'] = [];
                }
                leaf['$files'].push(part);

            }
        }

        return callback();
    }

    function endStream(cb) {
        var joinedFile;

        if (!firstFile || !concat) {
            cb();
            return;
        }

        if (typeof file === 'string') {
            joinedFile = firstFile.clone({
                contents: false
            });
            joinedFile.path = path.join(firstFile.base, file);
        } else {
            joinedFile = firstFile;
        }
        var content = render(concat);
        joinedFile.contents = new Buffer(content);
        this.push(joinedFile);
        cb();
    }

    function render(object, depth, path) {
        depth = depth || 0;
        path = path || '';

        var result = "";
        var files_str = "";
        var prep = ' '.repeat(depth * 4) + '* ';

        for (var key in object) {

            if (object.hasOwnProperty(key)) {
                if (key === '$files') {
                    object[key].forEach(function (elem) {
                        files_str += prep + '[' + elem + ']';
                        files_str += '(' + path + '/' + elem + ')' + '\n';
                    });
                } else if (typeof object[key] === 'object') {
                    result += prep + key + '\n';
                    result += render(object[key], depth + 1, path + '/' + key);
                }
            }
        }

        result += files_str;
        return result;
    }

    return through.obj(makeIndex, endStream);
};