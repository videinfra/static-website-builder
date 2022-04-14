const chalk = require('chalk');

module.exports = function (error) {
    if (error.plugin) {
        console.log('Error \'' + chalk.cyan(error.plugin) + '\' ' + chalk.red(error.message));

    } else {
        console.log(error.toString().split(': ').join(':\n'));
    }

    // Emit the end event, to properly end the task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
}
