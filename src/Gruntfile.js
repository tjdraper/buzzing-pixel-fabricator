/* globals module */

module.exports = function(grunt) {
    // Set global items
    grunt.fabConfig = {};
    grunt.fabInitConfig = {};

    // Set up configuration
    require(__dirname + '/grunt/configure.js')(grunt);

    // Load NPM tasks
    require(__dirname + '/grunt/loadNpmTasks.js')(grunt);

    // Create initial clean up task
    require(__dirname + '/grunt/initialCleanup.js')(grunt);

    // Configure clean
    require(__dirname + '/grunt/cleanConfig.js')(grunt);

    // Configure copy
    require(__dirname + '/grunt/copyConfig.js')(grunt);

    // Configure Less
    require(__dirname + '/grunt/lessConfig.js')(grunt);

    // Configure javascript
    require(__dirname + '/grunt/javascriptConfig.js')(grunt);

    // Configure jshint
    require(__dirname + '/grunt/jshintConfig.js')(grunt);

    // Configure jscs
    require(__dirname + '/grunt/jscsConfig.js')(grunt);

    // Configure notify
    require(__dirname + '/grunt/notifyConfig.js')(grunt);

    // Configure browser sync
    require(__dirname + '/grunt/browserSyncConfig.js')(grunt);

    // Configure watch
    require(__dirname + '/grunt/watchConfig.js')(grunt);

    // Initialze grunt config
    grunt.initConfig(grunt.fabInitConfig);

    // Register tasks
    require(__dirname + '/grunt/registerTasks.js')(grunt);
};