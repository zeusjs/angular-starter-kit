module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        project: {

            shortName: 'myApp',
            companyName: 'Acme Corp',
            src: 'src',
            libs: 'lib',
            dist: 'dist'
        },

        pkg: grunt.file.readJSON('bower.json'),

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= project.src %>/scripts/{,*/}*.js'],
                tasks: ['newer:jscs:src', 'newer:jshint:all'],
                options: {
                    livereload: true
                }
            },

            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },

            sass: {
                files: [
                    '<%= project.src %>/styles/{,*/}*.scss',
                    '<%= project.src %>/styles/variables/{,*/}*.scss'
                ],
                tasks: ['sass:server', 'autoprefixer']
            },

            colors: {
                files: ['<%= project.src %>/styles/variables/colors/{,*/}*.scss'],
                tasks: ['ngSassColors']
            },

            gruntfile: {
                files: ['Gruntfile.js']
            },

            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['<%= project.src %>/templates/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= project.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}']
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,

                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= project.src %>',
                        '.',
                        '<%= project.src %>/templates/flask',
                        '.tmp']
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: ['.tmp',
                        'test',
                        '<%= project.src %>']
                }
            },
            dist: {
                options: {
                    base: '<%= project.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        eslint: {

            sources: {
                src: ['src/scripts/{,.*/}*.js']
            },
            scripts: {
                src: ['Gruntfile.js']
            },
            tests: {
                options: {
                    globals: ['angular', 'd3'],
                    envs: ['jasmine', 'amd', 'node', 'browser']
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['.tmp',
                        '<%= project.dist %>/*',
                        '!<%= project.dist %>/.git*']
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            options: {

                //cwd: '<%= project.src %>'
            },
            app: {
                src: '<%= project.src %>/index.html',
                ignorePath: '<%= project.src %>/',
                exclude: 'lib/bootstrap-sass-official/vendor/assets/javascripts/'
            },
            sass: {
                src: ['<%= project.src %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: '<%= project.libs %>'
            }
        },

        ngSassColors: {
            palette: {
                options: {
                    variablesLike: /color_(?:role)|(?:status)|(?:viz)/,
                    stripPrefix: 'color_',
                    module: 'zsApp'
                },
                files: {
                    'src/scripts/values/color_palette.js': ['src/styles/variables/colors/*.scss']
                }
            }
        },

        sass: {
            options: {},

            dist: {
                options: {
                    generatedImagesDir: '<%= project.dist %>/images/generated'
                },
                files: {
                    '.tmp/styles/my_app.css': '<%= project.src %>/styles/index.scss'
                }
            },

            server: {
                options: {
                    debugInfo: true
                },
                files: {
                    '.tmp/styles/my_app.css': '<%= project.src %>/styles/index.scss'
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: ['<%= project.dist %>/scripts/{,*/}*.js',
                    '<%= project.dist %>/styles/{,*/}*.css',
                    '<%= project.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= project.dist %>/styles/fonts/*']
            }
        },


        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: {
                src: ['<%= project.src %>/index.html',
                    '<%= project.src %>/templates/flask/login.html']
            },
            options: {
                dest: '<%= project.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            index: '<%= project.dist %>/index.html',
            login: '<%= project.dist %>/templates/flask/login.html',
            appRoots: ['<%= project.dist %>/index.html',
                    '<%= project.dist %>/templates/flask/*.html'],
            views: ['<%= project.dist %>/templates/controllers/*.html',
                    '<%= project.dist %>/templates/directives/*.html',
                    '<%= project.dist %>/templates/fragments/*.html',
                    '<%= project.dist %>/templates/modals/*.html'],

            css: ['<%= project.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= project.dist %>'],
                patterns: {
                    css: [[
                            /(\/images\/[\w\-]+\.svg)/g,
                            'Replacing icon references in img tags']
                    ],
                    views: [[
                            /(\/images\/[\w\-]+\.svg)/g,
                            'Replacing icon references in img tags']
                    ],
                    index: [[
                            /(scripts\/app\-ui\.js)/g,
                            'Replacing references to built js'],
                        [
                            /(scripts\/vendor\.js)/g,
                            'Replacing references to vendor.js']
                    ],
                    login: [[
                            /(scripts\/app\-login\-ui\.js)/g,
                            'Replacing references to built login UI js'],
                        [
                            /(scripts\/login_vendor\.js)/g,
                            'Replacing references to login_vendor.js']
                    ],
                    appRoots: [[
                                /(styles\/app\.css)/g,
                                'Replacing icon references to compiled CSS'],
                            [
                                /(\/images\/[\w\-]+\.svg)/g,
                                'Replacing icon references in img tags']
                        ]
                    }
                }
            },

            uglify: {
                options: {
                    banner: '/*! Copyright (C) <%= grunt.template.today("yyyy") %>. ' +
                        '<%= project.companyName %>\n' +
                        '<%= pkg.fullName %> - v<%= pkg.version %>.' +
                        '<%= process.env.BUILD_NUMBER %> */\n',

                    compress: {
                        /*eslint-disable camelcase */
                        drop_console: true
                        /*eslint-enable camelcase */
                    },
                    preserveComments: false
                }
            },

            // The following *-min tasks produce minified files in the dist folder
            cssmin: {
                options: {
                    root: '<%= project.src %>',
                    keepSpecialComments: 0,
                    banner: '/*! Copyright (C) <%= grunt.template.today("yyyy") %>. ' +
                        '<%= project.companyName %>\n' +
                        '<%= pkg.fullName %> - v<%= pkg.version %>.' +
                        '<%= process.env.BUILD_NUMBER %> */\n'
                }
            },

            imagemin: {
                options: {
                    cache: false
                },
                dist: {
                    files: [{
                        expand: true,
                        cwd: '<%= project.src %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= project.dist %>/images'
                    }]
                }
            },

            svgmin: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: '<%= project.src %>/images',
                        src: ['{,*/}*.svg'],
                        dest: '<%= project.dist %>/images'
                    }]
                }
            },

            htmlmin: {
                dist: {
                    options: {
                        collapseWhitespace: true,
                        removeCommentsFromCDATA: true,
                        removeComments: true
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= project.dist %>',
                        src: ['*.html', 'templates/{,*/}*.html'],
                        dest: '<%= project.dist %>'
                    }]
                }
            },

            // ng-annotate tries to make the code safe for minification automatically
            // by using the Angular long form for dependency injection.
            ngAnnotate: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: 'app-ui.js',
                        dest: '.tmp/concat/scripts'
                    }]
                }
            },

            // Replace Google CDN references
            cdnify: {
                dist: {
                    html: ['<%= project.dist %>/*.html']
                }
            },

            ngdocs: {
                options: {
                    dest: 'docs',
                    html5Mode: false,
                    title: 'App GUI',
                    startPage: '/api',
                    editExample: false,
                    styles: ['docs/css/app.css'],
                    scripts: ['docs/js/vendor.js',
                        'docs/js/angular-animate.min.js',
                        'docs/js/app-ui.js']
                },
                api: ['src/scripts/services/*.js',
                  'src/scripts/directives/*.js',
                  'src/scripts/filters/*.js']
            },

            sloc: {
                'source-code': {
                    files: {
                        '<%= project.src %>': ['scripts/**/*.js',
                            'scripts/*.js',
                            'templates/**/*.html',
                            'styles/**/*.scss',
                            'styles/*.scss']
                    }
                },
                tests: {
                    files: {
                        test: ['spec/**/*.js',
                            'mock_views/*.html']
                    }
                }
            },

            // Copies remaining files to places other tasks can use
            copy: {
                release: {
                    files: [{
                        expand: true,
                        dot: true,
                        cwd: '<%= project.src %>',
                        dest: '<%= project.dist %>',
                        src: ['*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'templates/{,*/}*.html',
                            'images/{,*/}*.{webp}']
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= project.dist %>/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        flatten: true,

                        dest: '<%= project.dist %>/fonts/',
                        src: [
                            '<%= project.libs %>/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*',
                            '<%= project.libs %>/font-awesome-4.1.0/fonts/*.*',
                            '<%= project.libs %>/open_sans/*']
                    },
                    {
                        expand: true,
                        flatten: true,
                        dest: '.tmp/fonts/',
                        src: [
                            '<%= project.libs %>/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*',
                            '<%= project.libs %>/font-awesome-4.1.0/fonts/*.*',
                            '<%= project.libs %>/open_sans/*']
                    }]
                },

                docs: {
                    files: [{
                        expand: true,
                        dot: true,
                        cwd: '<%= project.src %>',
                        dest: 'docs',
                        src: ['templates/{,*/}*.html',
                            'images/{,*/}*.{webp}']
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: 'docs/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        flatten: true,
                        dest: 'docs/fonts/',
                        src: [
                            '<%= project.libs %>/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*',
                            '<%= project.libs %>/font-awesome-4.1.0/fonts/*.*',
                            '<%= project.libs %>/open_sans/*']
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.tmp/concat/scripts',
                        dest: 'docs/js',
                        src: ['*.js']
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= project.libs %>/angular-animate',
                        dest: 'docs/js',
                        src: ['angular-animate.min.js']
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.tmp/styles',
                        dest: 'docs/css',
                        src: ['*.css']
                    }]
                },

            // copy:build doesnt use uglify or cssmin
            // so we need to copy js and css files ourselves
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= project.src %>',
                    dest: '<%= project.dist %>',
                    src: ['*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'templates/{,*/}*.html',
                            'images/{,*/}*.{webp}',
                            'fonts/*']
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= project.dist %>/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.tmp/concat/scripts',
                        dest: '<%= project.dist %>/scripts',
                        src: ['*.js']
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.tmp/styles',
                        dest: '<%= project.dist %>/styles',
                        src: ['*.css']
                    },
                    {
                        expand: true,
                        flatten: true,
                        dest: '<%= project.dist %>/fonts/',
                        src: [
                            '<%= project.libs %>/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*',
                            '<%= project.libs %>/font-awesome-4.1.0/fonts/*.*',
                            '<%= project.src %>/fonts/open_sans/*'
                        ]
                    },
                    {
                        expand: true,
                        flatten: true,
                        dest: '.tmp/fonts/',
                        src: [
                            '<%= project.libs %>/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*',
                            '<%= project.libs %>/font-awesome-4.1.0/fonts/*.*',
                            '<%= project.src %>/open_sans/*']
                    }]
                },

                styles: {
                    expand: true,
                    cwd: '<%= project.src %>/styles',
                    dest: '.tmp/styles/',
                    src: '{,*/}*.css'
                },

                fonts: {
                    expand: true,
                    flatten: true,

                    dest: '.tmp/fonts/',
                    src: [
                        '<%= project.libs %>/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*.*',
                        '<%= project.libs %>/font-awesome-4.1.0/fonts/*.*',
                        '<%= project.src %>/fonts/open_sans/*.*']
                }
            },

            // Run some tasks in parallel to speed up the build process
            concurrent: {
                server: ['sass:server',
                    'copy:fonts'],

                test: ['sass'],

                dist: ['sass:dist',
                    'imagemin',
                    'svgmin']
            },

            // Test settings
            karma: {
                unit: {
                    configFile: 'karma.conf.js',
                    singleRun: true
                }
            }
    });


    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'ngSassColors',
            'wiredep',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('lint', ['eslint']);

    grunt.registerTask('test', [
        'lint',
        'jshint:test',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('docs', [
        'copy:docs',
        'ngdocs'
    ]);

    grunt.registerTask('build', [
        'ngSassColors',
        'test',
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'copy:build',
        'docs',
        'usemin',
        'sloc'
    ]);

    grunt.registerTask('release', [
        'ngSassColors',
        'test',
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'copy:release',
        'docs',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin',
        'sloc'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
