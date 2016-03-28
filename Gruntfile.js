/*============================================================================*\
	DO NOT EDIT THIS FILE. THIS IS A CORE FILE.
/*============================================================================*/

module.exports = function(grunt) {
	var key;
	var packageFile = grunt.file.readJSON('package.json');
	var projectFile = grunt.file.readJSON('project.json');
	var watch = projectFile.watch;
	var root = projectFile.root;
	var assetsPath = root + '/' + projectFile.assets;
	var assetsSource = projectFile.source;
	var enabledJsComponents = projectFile.enabledJsComponents;
	var conf = {
		root: root,
		assetsPath: assetsPath,
		assetsSource: assetsSource,
		bsFiles: {
			src: [
				assetsPath + '/css/style.min.css',
				assetsPath + '/js/lib/**/*.js',
				assetsPath + '/js/**/*.js'
			]
		},
		bsOptions: {
			watchTask: true,
			proxy: projectFile.proxy,
			ghostMode: {
				clicks: false,
				forms: false,
				scroll: false,
				links: false
			},
			open: 'local',
			notify: false
		},
		lessCompress: projectFile.lessCompress,
		lessFiles: {},
		jsFiles: {},
		sourceMaps: projectFile.sourceMaps
	};

	/**
	 * Delete files and cache
	 */

	// Delete compile cache
	grunt.file.delete(assetsSource + '/coreFAB/compileCache/js/');

	// Delete module files
	grunt.file.delete(assetsPath + '/modules/');

	// Delete JS files
	grunt.file.delete(assetsPath + '/js/');

	// Delete font files
	grunt.file.delete(assetsPath + '/fonts/');

	// Delete CSS files
	grunt.file.delete(assetsPath + '/css/');

	// Delete images
	grunt.file.delete(assetsPath + '/img/');

	/**
	 * Delete and clean up various files for re-copying/compiling
	 */

	// Configure additional watch files
	conf.bsFiles.src = watch.concat(conf.bsFiles.src);

	// Configure proxy
	if (projectFile.proxy === false) {
		conf.bsOptions.open = false;
	}

	/**
	 * Configure CSS
	 */

	conf.lessFiles[assetsPath + '/css/style.min.css'] = [
		assetsSource + '/coreFAB/css/fab.less'
	];

	if (projectFile.lessBuild.length) {
		projectFile.lessBuild.forEach(function(i) {
			conf.lessFiles[assetsPath + '/css/style.min.css'].push(
				assetsSource + '/' + i
			);
		});
	}

	if (Object.keys(projectFile.lessFiles).length) {
		for (key in projectFile.lessFiles) {
			conf.lessFiles[assetsPath + '/' + key] =
				assetsSource + '/' + projectFile.lessFiles[key];
		}
	}

	/**
	 * Configure JS
	 */

	conf.jsFiles[assetsPath + '/js/script.min.js'] = [];

	if (projectFile.jsBuildBefore.length) {
		projectFile.jsBuildBefore.forEach(function(i) {
			conf.jsFiles[assetsPath + '/js/script.min.js'].push(
				assetsSource + '/' + i
			);
		});
	}

	if (enabledJsComponents.indexOf('base') > -1) {
		conf.jsFiles[assetsPath + '/js/script.min.js'].push(
			assetsSource + '/coreFAB/js/fab.js',
			assetsSource + '/coreFAB/js/base/**/*.js',
			assetsSource + '/js/controller.js'
		);
	}

	conf.jsFiles[assetsPath + '/js/script.min.js'].push(
		assetsSource + '/js/build/**/*.js',
		assetsSource + '/modules/build/**/js/config.js',
		assetsSource + '/modules/build/**/js/**/*.js'
	);

	if (projectFile.jsBuild.length) {
		projectFile.jsBuild.forEach(function(i) {
			conf.jsFiles[assetsPath + '/js/script.min.js'].push(
				assetsSource + '/' + i
			);
		});
	}

	if (enabledJsComponents.indexOf('base') > -1) {
		conf.jsFiles[assetsPath + '/js/script.min.js'].push(
			assetsSource + '/coreFAB/js/ready.js'
		);
	}

	if (projectFile.jsBuildAfter.length) {
		projectFile.jsBuildAfter.forEach(function(i) {
			conf.jsFiles[assetsPath + '/js/script.min.js'].push(
				assetsSource + '/' + i
			);
		});
	}

	if (Object.keys(projectFile.jsFiles).length) {
		for (key in projectFile.jsFiles) {
			conf.jsFiles[assetsPath + '/' + key] =
				assetsSource + '/' + projectFile.jsFiles[key];
		}
	}

	// Copy JS lib
	grunt.file.expand(assetsSource + '/js/lib/**/*').forEach(function(i) {
		var file = i.split('/');
		var newFile = assetsPath + '/';

		if (grunt.file.isFile(i)) {
			file.shift();
			newFile += file.join('/');

			// Copy the file into place
			grunt.file.copy(i, newFile);
		}
	});

	/**
	 * Configure modules
	 */

	// Copy build modules lib, font, and image files
	grunt.file.expand(assetsSource + '/modules/build/*').forEach(function(i) {
		var moduleName = i.split('/').pop();

		// Copy lib CSS files
		grunt.file.expand(i + '/css/lib/**/*').forEach(function(file) {
			var fileName = file.replace(i, '');

			if (grunt.file.isFile(file)) {
				grunt.file.copy(
					file,
					assetsPath + '/modules/' + moduleName + fileName
				);
			}
		});

		// Copy image files
		grunt.file.expand(i + '/img/**/*').forEach(function(file) {
			var fileName = file.replace(i, '');

			if (grunt.file.isFile(file)) {
				grunt.file.copy(
					file,
					assetsPath + '/modules/' + moduleName + fileName
				);
			}
		});

		// Copy font files
		grunt.file.expand(i + '/font/**/*').forEach(function(file) {
			var fileName = file.replace(i, '');

			if (grunt.file.isFile(file)) {
				grunt.file.copy(
					file,
					assetsPath + '/modules/' + moduleName + fileName
				);
			}
		});
	});

	// Add module compile
	grunt.file.expand(assetsSource + '/modules/compile/*').forEach(function(i) {
		var moduleName = i.split('/').pop();

		// Copy the module primary less file into place
		grunt.file.copy(
			assetsSource + '/coreFAB/css/module.less',
			i + '/css/module.less'
		);

		// Configure module Less
		conf.lessFiles[assetsPath + '/modules/' + moduleName + '/css/style.min.css'] = i + '/css/module.less';

		// Configure module JS
		conf.jsFiles[assetsPath + '/modules/' + moduleName + '/js/script.min.js'] = [];
		conf.jsFiles[assetsPath + '/modules/' + moduleName + '/js/script.min.js'].push(i + '/js/config.js');
		conf.jsFiles[assetsPath + '/modules/' + moduleName + '/js/script.min.js'].push(i + '/js/**/*.js');

		// Copy lib CSS files
		grunt.file.expand(i + '/css/lib/**/*').forEach(function(file) {
			var fileName = file.replace(i, '');

			if (grunt.file.isFile(file)) {
				grunt.file.copy(
					file,
					assetsPath + '/modules/' + moduleName + fileName
				);
			}
		});

		// Copy image files
		grunt.file.expand(i + '/img/**/*').forEach(function(file) {
			var fileName = file.replace(i, '');

			if (grunt.file.isFile(file)) {
				grunt.file.copy(
					file,
					assetsPath + '/modules/' + moduleName + fileName
				);
			}
		});

		// Copy font files
		grunt.file.expand(i + '/font/**/*').forEach(function(file) {
			var fileName = file.replace(i, '');

			if (grunt.file.isFile(file)) {
				grunt.file.copy(
					file,
					assetsPath + '/modules/' + moduleName + fileName
				);
			}
		});
	});

	/**
	 * Copy fonts
	 */

	grunt.file.expand(assetsSource + '/fonts/**/*').forEach(function(i) {
		var file = i.split('/');
		var newFile = assetsPath + '/';

		if (grunt.file.isFile(i)) {
			file.shift();
			newFile += file.join('/');

			// Copy the file into place
			grunt.file.copy(i, newFile);
		}
	});

	/**
	 * Copy CSS lib
	 */

	grunt.file.expand(assetsSource + '/css/lib/**/*').forEach(function(i) {
		var file = i.split('/');
		var newFile = assetsPath + '/';

		if (grunt.file.isFile(i)) {
			file.shift();
			newFile += file.join('/');

			// Copy the file into place
			grunt.file.copy(i, newFile);
		}
	});

	/**
	 * Copy images
	 */

	grunt.file.expand(assetsSource + '/img/**/*').forEach(function(i) {
		var file = i.split('/');
		var newFile = assetsPath + '/';

		if (grunt.file.isFile(i)) {
			file.shift();
			newFile += file.join('/');

			// Copy the file into place
			grunt.file.copy(i, newFile);
		}
	});

	/**
	 * Configure version file
	 */

	// Write version file
	grunt.file.write(assetsSource + '/coreFAB/compileCache/js/version.js', '$(function() {window.FAB = window.FAB || {};window.FAB.version = "' + packageFile.version + '";});');

	// Include version file
	conf.jsFiles[assetsPath + '/js/script.min.js'].push(
		assetsSource + '/coreFAB/compileCache/js/version.js'
	);

	grunt.initConfig({
		conf: conf,
		projectFile: projectFile,
		browserSync: {
			bsFiles: conf.bsFiles,
			options: conf.bsOptions
		},
		notify: {
			less: {
				options: {
					title: 'CSS',
					message: 'CSS compiled successfully'
				}
			},
			uglify: {
				options: {
					title: 'Javascript',
					message: 'Javascript compiled successfully'
				}
			}
		},
		less: {
			development: {
				options: {
					compress: conf.lessCompress,
					yuicompress: conf.lessCompress,
					optimization: 2,
					plugins: [
						require('less-plugin-glob')
					]
				},
				files: conf.lessFiles
			}
		},
		uglify: {
			build: {
				options: {
					sourceMap: conf.sourceMaps
				},
				files: conf.jsFiles
			}
		},
		jshint: {
			files: [
				'<%= conf.assetsSource %>/js/build/**/*.js',
				'<%= conf.assetsSource %>/js/*.js'
			],
			options: {
				jshintrc: true
			}
		},
		jscs: {
			src: [
				'<%= conf.assetsSource %>/js/build/**/*.js',
				'<%= conf.assetsSource %>/js/*.js'
			],
			options: {
				config: '.jscs.json'
			}
		},
		watch: {
			grunt: {
				files: [
					'Gruntfile.js',
					'<%= conf.assetsSource %>/fonts/**/*',
					'<%= conf.assetsSource %>/img/**/*',
					'<%= conf.assetsSource %>/modules/buiild/*',
					'<%= conf.assetsSource %>/modules/compile/*'
				],
				tasks: [
					'less',
					'notify:less',
					'uglify',
					'notify:uglify'
				]
			},
			styles: {
				files: [
					'<%= conf.assetsSource %>/coreFAB/css/**/*',
					'<%= conf.assetsSource %>/css/**/*.less',
					'<%= conf.assetsSource %>/css/**/*.css',
					'<%= conf.assetsSource %>/modules/build/**/css/**/*.less',
					'<%= conf.assetsSource %>/modules/build/**/css/**/*.css',
					'<%= conf.assetsSource %>/modules/compile/**/css/**/*.less',
					'<%= conf.assetsSource %>/modules/compile/**/css/**/*.css'
				],
				tasks: [
					'less',
					'notify:less'
				],
				options: {
					spawn: false
				}
			},
			javascript: {
				files: [
					'<%= conf.assetsSource %>/coreFAB/js/**/*',
					'<%= conf.assetsSource %>/js/**/*.js',
					'<%= conf.assetsSource %>/modules/build/**/js/**/*.js',
					'<%= conf.assetsSource %>/modules/compile/**/js/**/*.js'
				],
				tasks: [
					'uglify',
					'notify:uglify'
				],
				options: {
					spawn: false
				}
			},
			jshint: {
				files: [
					'<%= jshint.files %>'
				],
				tasks: [
					'jshint'
				],
				options: {
					spawn: false
				}
			},
			jscs: {
				files: [
					'<%= jscs.src %>'
				],
				tasks: [
					'jscs'
				],
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-browser-sync');

	grunt.registerTask('default', [
		'less',
		'uglify',
		'notify:less',
		'notify:uglify',
		'browserSync',
		'watch'
	]);

	grunt.registerTask('compile', [
		'less',
		'uglify'
	]);
};
