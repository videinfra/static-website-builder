var gutil = require('gulp-util');

module.exports = function (error) {
    if (error.plugin) {
        gutil.log('Error \'' + gutil.colors.cyan(error.plugin) + '\' ' + gutil.colors.red(error.message));
    } else {
        gutil.log(error.toString().split(': ').join(':\n'));
    }

    // Emit the end event, to properly end the task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
}
