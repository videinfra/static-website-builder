module.exports = function dataLoaderJS (fileName) {
    // Re-load script each time this function is called
    delete require.cache[require.resolve(fileName)];
    return require(fileName);
};
