module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks("grunt-notify");
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-angular-templates');

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            files: ['Gruntfile.js', 'app/src/js/**/*.js'],
            options: {
                undef: false,
                unused: false,
                nonstandard: true,
                sub: true,
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'jshint-report.html',
                force: false,
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    'dist/angular-on-screen-keyboard.min.js': ['js/angular-on-screen-keyboard.js']
                }
            }
        },
        uglify: {
            main: {
                src: [
                    "dist/angular-on-screen-keyboard.min.js"
                ],
                dest: "dist/angular-on-screen-keyboard.min.js"
            }
        },
        ngtemplates: {
            app: {
                src: 'templates/*.html',
                dest: 'dist/templates.js',
                cwd: '',
                options: {
                    module: 'onScreenKeyboard',
                    prefix: '/',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },
        less: {
            options: {
                ieCompat: true,
                report: 'min'
            },
            production: {
                options: {
                    compress: true
                },
                files: {
                    "dist/angular-on-screen-keyboard.min.css": [
                        "css/*.less"
                    ]
                }
            }
        },
        concat: {
            app: {
                options: {
                    separator: ';\n',
                    sourceMap: true
                },
                files: [
                    {'dist/angular-on-screen-keyboard.min.js': ['dist/*.js']}
                ]
            }
        },
        clean: ['dist/templates.js'],
        watch: {
            files: [
                "Gruntfile.js",
                "css/*.less",
                "js/**/*.js"
            ],
            tasks: [
                'default'
            ],
            options: {
                spawn: true,
                interrupt: true,
                livereload: true
            }
        },
        browserSync: {
            app: {
                bsFiles: {
                    src : [
                        'demo.html',
                        'dist/angular-on-screen-keyboard.min.js',
                        'templates/*.html',
                        'dist/angular-on-screen-keyboard.min.css',
                    ]
                },
                options: {
                    watchTask: true,
                    server: './'
                }
            }
        }
    });
    grunt.registerTask('default', [
        'jshint',
        'less',
        'ngAnnotate',
        'uglify',
        'ngtemplates',
        'concat',
        'clean',
        'browserSync',
        'watch'
    ]);
};
