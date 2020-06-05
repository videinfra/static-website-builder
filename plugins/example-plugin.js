// Configuration for the example task
exports.example = {
    extensions: ['example'],
};

// Function which can validate and modify configuration
exports.preprocess = {
    example: [
        require('./example-plugin/preprocess-config'),
    ]
};

// Gulp task
exports.tasks = {
    example: [
        require('./example-plugin/task'),
    ]
};
