const path = require('path');
const argv = require('yargs').argv;
const parts = require('./webpack.parts');

const tests = './tests/**/*.spec.js';
const coveragePath = './artifacts';

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  process.env.BABEL_ENV = "karma";

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      tests
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      [tests]: ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'spec', 'coverage'],

    coverageReporter: {
      dir: coveragePath,
      reporters: [{ type: 'json', subdir: 'coverage' }, { type: 'lcov', subdir: 'coverage' }],
    },

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
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: !argv.watch,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: parts.loadJavaScript({
      include: [path.join(__dirname, 'src')]
    }),
  })
};
