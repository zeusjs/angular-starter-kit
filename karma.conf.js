// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: ['src/extern/jquery/dist/jquery.js',
            'src/extern/angular/angular.js',
            'src/extern/angular-mocks/angular-mocks.js',
            'src/extern/angular-ui-router/release/angular-ui-router.js',
            'src/extern/angular-bootstrap/ui-bootstrap-tpls.js',
            'src/extern/angular-translate/angular-translate.js',
            'src/extern/d3/d3.js',

            'src/scripts/index.js',
            'src/scripts/providers/*.js',
            'src/scripts/config/*.js',
            'src/scripts/services/*.js',
            'src/scripts/filters/*.js',
            'src/scripts/controllers/*.js',
            'src/scripts/directives/*.js',
            'src/scripts/values/*.js',

            'src/templates/directives/*.html',

            'test/spec/**/*.js',
            'src/mock_json/**/*.json',
            'test/mock_views/*.html',
            'test/fixtures/**/*.json'],

        ngJson2JsPreprocessor: {

            cacheIdFromPath: function(jsonPath) {
                if (jsonPath.indexOf('src/mock_json/') === 0) {

                    return jsonPath.replace('src/mock_json/', 'mock/');

                } else if (jsonPath.indexOf('test/fixtures/') === 0) {
                    return jsonPath.replace('test/fixtures/', 'dummy/');
                }
            }

        },

        ngHtml2JsPreprocessor: {

            // strip this from the file path
            stripPrefix: 'src/'
        },

        // list of files / patterns to exclude

        exclude: [
            'src/scripts/services/*_xhr.js',
            'test/spec/services/*_xhr.js'
        ],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        reporters: ['progress', 'junit', 'coverage'],

        preprocessors: {'src/scripts/controllers/*.js': ['coverage'],
            'src/scripts/filters/*.js': ['coverage'],
            'src/scripts/services/*.js': ['coverage'],
            'src/scripts/providers/*.js': ['coverage'],
            'src/scripts/directives/*.js': ['coverage'],
            'src/mock_json/**/*.json': ['json2js'],
            'test/fixtures/**/*.json': ['json2js'],
            'src/templates/directives/*.html': ['ng-html2js'],
            'test/mock_views/*.html': ['html2js']
        },


        plugins: [
            'karma-ng-json2js-preprocessor',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-ng-html2js-preprocessor',
            'karma-html2js-preprocessor'
        ],

        // the default configuration
        junitReporter: {
            outputFile: 'test-results.xml',
            suite: ''
        },

        coverageReporter: {
            type: 'cobertura',
            dir: '.coverage/'
        }
    });
};
