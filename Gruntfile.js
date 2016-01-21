module.exports = function ( grunt ) {

	grunt.initConfig( {
		jshint: {
			files: [ 'Gruntfile.js', 'plugin-v2/clipper.js', 'plugin-v2/background.js' ],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		watch: {
			files: [ '<%= jshint.files %>' ],
			tasks: [ 'jshint' ]
		},
		jsbeautifier: {
			files: [ '<%= jshint.files %>' ],
			options: {
				js: {
					braceStyle: "collapse",
					breakChainedMethods: true,
					e4x: false,
					evalCode: false,
					indentChar: " ",
					indentLevel: 0,
					indentSize: 4,
					indentWithTabs: true,
					jslintHappy: true,
					keepArrayIndentation: true,
					keepFunctionIndentation: true,
					maxPreserveNewlines: 10,
					preserveNewlines: true,
					spaceBeforeConditional: true,
					spaceInParen: true,
					unescapeStrings: true,
					wrapLineLength: 85,
					endWithNewline: true
				}
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jsbeautifier' );

	grunt.registerTask( 'default', [ 'jshint', 'jsbeautifier' ] );

};
