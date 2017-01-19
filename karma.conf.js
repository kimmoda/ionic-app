/*================================================================================================================================================
 =                                             KARMA UNIT TESTS RUNNER CONFIGURATION FILE                                                        =
 = Karma is essentially a tool which spawns a web server that executes source code against test code for each of the browsers connected.         =
 = The results for each test against each browser are examined and displayed via the command line to the developer such that they can see        =
 = which browsers and tests passed or failed.
 ================================================================================================================================================*/

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'], // ui and unit testing frameworks


        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/firebase/firebase.js',
            'bower_components/angularfire/dist/angularfire.js',
            'bower_components/angular-toArrayFilter/toArrayFilter.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/firebase-util/dist/firebase-util.js',
            'app/scripts/**/*.js',
            'app/scripts/unit-test/**/*-test.js'
        ],


        // list of files to exclude
        exclude: [
            'bower_components/**/*.min.js',
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
