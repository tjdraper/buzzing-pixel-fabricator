/*============================================================================*\
	DO NOT EDIT THIS FILE. THIS IS A CORE FILE.
/*============================================================================*/

module.exports = function(grunt, vars) {
	// Write version file
	grunt.file.write(vars.assetsSource + '/coreFAB/compileCache/js/version.js', '$(function() {window.FAB = window.FAB || {};window.FAB.version = "' + vars.packageFile.version + '";});');

	// Include version file
	vars.conf.jsFiles[vars.assetsPath + '/js/script.min.js'].push(
		vars.assetsSource + '/coreFAB/compileCache/js/version.js'
	);

	// Return the modified variables
	return vars;
};