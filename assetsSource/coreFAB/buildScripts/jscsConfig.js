/*============================================================================*\
	DO NOT EDIT THIS FILE. THIS IS A CORE FILE.
/*============================================================================*/

module.exports = function(grunt) {
	// Set grunt config for jscs
	grunt.fabInitConfig.jscs = {
		src: [
			grunt.fabConfig.source + '/js/**/*.js',
			'!' + grunt.fabConfig.source + '/js/lib/**/*.js'
		],
		options: {
			config: '.jscs.json'
		}
	};
};