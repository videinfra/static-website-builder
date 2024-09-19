const chalk = require('chalk');

module.exports = function (error, failOnError = false) {
    console.log(chalk.red('Error') + ' in \'' + chalk.cyan(error.plugin || error.type) + '\'\nMessage:\n    ' + (error.messageFormatted || error.message));

    // Emit the end event, to properly end the task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }

    if (failOnError) {
        throw error;
    }
}
