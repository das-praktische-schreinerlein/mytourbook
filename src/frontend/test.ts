import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import {getTestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);
// Then we find all the files.
const context = require.context('./app', true, /(?!backend-only).*\.spec\.ts$/);
//TODO check const context2 = require.context('./shared', true, /(?!backend-only).*\.ts$/);
const context3 = require.context('./testing', true, /\.ts$/);
// And load the modules.
context.keys().map(context);
//TODO check context2.keys().map(context2);
context3.keys().map(context3);
// Finally, start Karma to run the tests.
__karma__.start();
