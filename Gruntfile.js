module.exports = function (grunt)
{

    grunt.initConfig(
        {
            ts:
            {
                dev1: {
                    src: [
                        "./ts/**/*.ts"	// The source typescript files, http://gruntjs.com/configuring-tasks#files
                    ],
                    reference: "./ts/reference.ts",  // If specified, generate this file that you can use for your reference management
                    //watch: './ts',                     // If specified, watches this directory for changes, and re-runs the current target
                    out:'./js/app.js',
                    options: {                         // use to override the default options, http://gruntjs.com/configuring-tasks#options
                        target: 'es5',                 // 'es3' (default) | 'es5'
                        module: 'commonjs',            // 'amd' (default) | 'commonjs'
                        sourceMap: true,               // true (default) | false
                        declaration: false,            // true | false (default)
                        removeComments: false           // true (default) | false
                    }
                }
            },
			reload: {
				port: 8001
			},
			watch: {
				ts:{
					files: './ts/**/*.ts',
					tasks: ['ts'],
					options: {
						livereload: true
					}
				}

			}


        });

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask("default",["ts","watch"]);

}
