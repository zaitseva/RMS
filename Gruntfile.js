module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		// cleanup build directory 
		clean: {
			dist: ['build']
		},



		concat: {
			css: {
				src: ['src/css/prebuild/*.scss'],
				dest: 'src/css/style.scss',
			},
			scrollcss: {
				src: ['src/css/common_ui/_mCustomScrollbar.scss' ],
				dest: 'src/css/mCustomScrollbar.css',
			},
			slickcss: {
				src: ['src/css/common_ui/_slick.scss' ],
				dest: 'src/css/slick.css',
			},
			bootstrapcss: {
				src: ['src/css/_bootstrap.scss'],
				dest: 'src/css/bootstrap.scss',
			},
			js: {
				src: ['src/js/script.js'],
				dest: 'build/js/script.js',
			},
			jsslick: {
				src: ['src/js/libs/priority_04/**/*.js'],
				dest: 'build/js/slick.js',
			},
			jsscroll: {
				src: ['src/js/libs/priority_03/**/*.js'],
				dest: 'build/js/mCustomScrollbar.js',
			},
			jsbootstrap: {
				src: ['src/js/libs/priority_02/**/*.js'],
				dest: 'build/js/bootstrap.js',
			},
			jsjquery: {
				src: ['src/js/libs/priority_01/**/*.js'],
				dest: 'build/js/jquery.js',
			}
		},

		// compile scss -> css and place css to build directory
		sass: {
			dist: {
				files: {
					'build/css/style.css': 'src/css/style.scss',
					'build/css/bootstrap.css': 'src/css/bootstrap.scss'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'Android >= <%= pkg.browsers.android %>',
					'Chrome >= <%= pkg.browsers.chrome %>',
					'Firefox >= <%= pkg.browsers.firefox %>',
					'Explorer >= <%= pkg.browsers.ie %>',
					'iOS >= <%= pkg.browsers.ios %>',
					'Opera >= <%= pkg.browsers.opera %>',
					'Safari >= <%= pkg.browsers.safari %>'
				]
			},
			dist: {
				src: ['build/css/**/*.css']
			}
		},

		csscomb: {
			dist: {
				options: {
					config: '.csscomb.json'
				},
				files: [{
					expand: true,
					cwd: 'build/css',
					src: '**/*.css',
					dest: 'build/css'
				}]
			}
		},
		prettify: {
			options: {
				brace_style: 'expand',
				indent: 1,
				indent_char: '	',
				condense: true,
				indent_inner_html: true
			},
			all: {
				expand: true,
				cwd: 'build',
				ext: '.html',
				src: '**/*.html',
				dest: 'build'
			},
		},



		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				force: true,
				globals: {
					jQuery: true
				}
			},
			all: [
				'build/js/**/*.js',
				'!build/js/libs.js',
			],
			configFiles: [
				'.csscomb.json',
				'Gruntfile.js',
				'package.json'
			]
		},



		copy: {
			// scripts: {
			// 	files: [{
			// 		expand: true,
			// 		cwd: 'src/js',
			// 		src: ['**/*.js', '!libs/**/*.js'],
			// 		dest: 'build/js',
			// 		filter: 'isFile'
			// 	}]
			// },
			main: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{php,html,json}'],
					dest: 'build/',
					filter: 'isFile'
				}]
			},
			font: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.{eot,ttf,woff,svg,css,woff2}'],
					dest: 'build',
					filter: 'isFile'
				}]
			}
		},


		imagemin: {
			images: {
				files: [{
					expand: true,
					cwd: 'src/images',
					src: ['**/*.{png,jpg,gif}', '!sprite/**/*'],
					dest: 'build/images'
				}]
			},
			icons: {
				files: [{
					expand: true,
					cwd: 'src/icons',
					src: ['**/*.{png,jpg,gif}', '!sprite/**/*'],
					dest: 'build/icons'
				}]
			}
		},


		connect: {
			options: {
			},
			server: {}
		},

		livereload: {
			options: {
				livereload: true
			},
			files: ['build/**/*']
		},


		watch: {
			options: {
				dateFormat: function (ms) {
					var now = new Date(),
						time = now.toLocaleTimeString(),
						day = now.getDate(),
						month = now.getMonth() + 1,
						year = now.getFullYear();

					if (day < 10) {
						day = '0' + day;
					}

					if (month < 10) {
						month = '0' + month;
					}

					grunt.log.subhead(
						'Completed in ' + Math.round(ms) + 'ms at ' + time + ' ' +
						day + '.' + month + '.' + year + '.\n' +
						'Waiting for more changes...'
					);
				},
				livereload: true,
			},
			configFiles: {
				options: {
					reload: true
				},
				files: ['.csscomb.json', 'Gruntfile.js', 'package.json'],
				tasks: ['newer:jshint:configFiles']
			},
			imagemin: {
				files: ['src/images/**/*.{png,jpg,gif}'],
				tasks: ['newer:imagemin:images']
			},
			iconmin: {
				files: ['src/icons/**/*.{png,jpg,gif}'],
				tasks: ['newer:imagemin:icons']
			},
			copyMain: {
				files: ['source/**/.{php,html,json}'],
				tasks: ['newer:copy:main']
			},
	    	htmldist: {
				files: ['src/**/*.html', 'src/tmpl/**/*.html'],
				tasks: ['newer:copy:main', 'newer:prettify']
			},
			fontcopy: {
				files: ['src/**/*.{eot,ttf,woff,svg,css}'],
				tasks: ['newer:copy:font']
			},
			// svgimgcopy: {
			// 	files: ['src/images/**/*.svg', '!src/images/sprite/**/*'],
			// 	tasks: ['copy:svgimage']
			// },
			sass: {
				files: ['src/**/*.scss'],
				tasks: ['concat:css', 'sass', 'autoprefixer','csscomb']		
			},
			scripts: {
				files: ['src/js/**/*.js', '!src/js/libs/**/*'],
				tasks: ['concat:js']
			},
			jshint: {
				files: ['build/js/**/*.js', '!build/js/libs.js'],
				tasks: ['newer:jshint:all']
			},
			libscripts: {
				files: ['src/js/libs/**/*'],
				tasks: ['concat:jslib']
			}
		}
	});


	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', [
		'clean',
		'concat',
		'sass',
		'autoprefixer',
		'csscomb',
		'prettify',
		'imagemin',
		'jshint',
		'copy'
	]);

	grunt.registerTask('default', [
		'build',
		'server',
		'watch'

	]);

	grunt.registerTask('server',[
		'connect'
	]);

};




