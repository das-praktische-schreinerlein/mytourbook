// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    plugins: [
      require('karma-jasmine' ),
      require('karma-chrome-launcher' ),
      require('karma-phantomjs-launcher' ),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma' )
    ],
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
    ],
    preprocessors: {
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly', 'text-summary' ],
      fixWebpackSourcePaths: true,
      dir: './coverage/frontend/'
    },
    coverageReporter: {
        instrumenterOptions: {
          istanbul: { noCompact: true }
        }
    },

    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul']
      : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'], // 'Chrome'
    singleRun: true,
    captureTimeout: 60000,
    browserDisconnectTimeout: 20000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000
  });
};
