/*----------------------------------------------------------------------------*\
    # Copyright 2017, BuzzingPixel, LLC

    # This program is free software: you can redistribute it and/or modify
    # it under the terms of the Apache License 2.0.
    # http://www.apache.org/licenses/LICENSE-2.0
\*----------------------------------------------------------------------------*/

/* globals module */

module.exports = function(grunt) {
    // Set browser sync options variable
    var bsOptions = {
        watchTask: true,
        proxy: grunt.fabConfig.proxy,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false,
            links: false
        },
        open: 'local',
        notify: false
    };

    // Disable browser open if proxy if false
    if (grunt.fabConfig.proxy === false) {
        bsOptions.open = false;
    }

    // Add css files to watch array
    grunt.fabConfig.watch.push(grunt.fabConfig.assets + '/css/**/*.css');

    // Add js files to watch array
    grunt.fabConfig.watch.push(grunt.fabConfig.assets + '/js/**/*.js');

    // Set grunt config for browserSync
    grunt.fabInitConfig.browserSync = {
        bsFiles: {
            src: grunt.fabConfig.watch
        },
        options: bsOptions
    };
};
