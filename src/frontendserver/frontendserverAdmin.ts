// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import * as express from 'express';
import {join} from 'path';
import {CacheModeType, MytbAngularUniversalModule, UniversalModuleConfig} from './mytb-angular-universal.module';

const minimist = require ('minimist');

// disable debug-logging
const debug = false;
if (!debug) {
    console.debug = function() {};
    console.log = function() {};
}

const argv = minimist(process.argv.slice(2));

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const distFolder = join(process.cwd(), 'dist');
const distProfile = 'mytbdev/de/'; //'DIST_PROFILE'; 'mytbdev/de/';
const distServerProfile = 'mytbdev-server/de/'; //'DIST_SERVER_PROFILE'; 'mytbdev-server/de/';

const frontendConfig: UniversalModuleConfig = {
    distServerProfile: distServerProfile,
    distFolder: distFolder,
    distProfile: distProfile,
    cacheFolder: 'cache/',
    cacheMode: CacheModeType.USE_CACHE
};

// Express server
const app = express();
MytbAngularUniversalModule.configureDefaultServer(app, frontendConfig);
app.get('/robots.txt', (req, res) => {
    res.status(200);
    res.sendFile(join(distFolder, distProfile, 'robots.txt'));
});
app.listen(4003, function () {
    console.error('MyTB app listening on port ' + 4003);
});

// Crawler
const supercrawler = require('supercrawler');
const crawler = new supercrawler.Crawler({
    // Tme (ms) between requests
    interval: 100,
    // Maximum number of requests at any one time.
    concurrentRequestsLimit: 1,
    // Time (ms) to cache the results of robots.txt queries.
    robotsCacheTime: 3600000,
    // Query string to use during the crawl.
    userAgent: 'Mozilla/5.0 (compatible; supercrawler/1.0; +https://github.com/brendonboshell/supercrawler)',
    // Custom options to be passed to request.
    request: {
        headers: {
            'x-custom-header': 'example'
        }
    }
});
crawler.on('crawlurl', function (url) {
    console.error('Crawling ' + url);
});
crawler.on('urllistempty', function () {
    console.warn('The URL queue is empty.');
    crawler.stop();
    process.exit(0);
});
crawler.on('handlersError', function (err) {
    console.error(err);
    crawler.stop();
    process.exit(0);
});
// Get 'Sitemaps:' directives from robots.txt
crawler.addHandler(supercrawler.handlers.robotsParser());
// Crawl sitemap files and extract their URLs.
crawler.addHandler(supercrawler.handlers.sitemapsParser());
crawler.getUrlList().insertIfNotExists(new supercrawler.Url({
    url: 'http://localhost:4003/robots.txt',
})).then(function () {
    console.error('Crawler startet', crawler.getUrlList());
    return crawler.start();
});
