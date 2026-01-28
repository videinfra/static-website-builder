import chalk  from 'chalk';

export default function (error, failOnError = false) {
    const message = String(error.messageFormatted || error.message);
    const messageTrimmed = message.length > 4096 ? message.slice(0, 512) + '...' : message;

    console.log(chalk.red('Error') + ' in \'' + chalk.cyan(error.plugin || error.type) + '\'\nMessage:\n    ' + messageTrimmed);

    if (failOnError) {
        throw error;
    } else if (this && typeof this.emit === 'function') {
        // Emit the end event, to properly end the task
        this.emit('end');
    }
}
