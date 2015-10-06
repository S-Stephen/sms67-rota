module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
                'copy:fonts',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
