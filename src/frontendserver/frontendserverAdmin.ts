// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import * as express from 'express';
import {join} from 'path';
import {default as Axios} from 'axios';
import {default as sitemaps} from 'sitemap-stream-parser';
import * as fs from 'fs';
import {MytbAngularUniversalModule} from './mytb-angular-universal.module';
import {CacheModeType, ServerModuleConfig} from './mytb-simple-server.module';

const minimist = require ('minimist');

const argv = minimist(process.argv.slice(2));

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const debug = argv['debug'] || false;
const maxNotCached = argv['maxNotCached'] || 999999;
const staticFolder = join(process.cwd(), 'dist/static');
const distProfile = 'DIST_PROFILE';
const distServerProfile = 'DIST_SERVER_PROFILE';

const filePathConfigJson = argv['frontend'] || 'config/frontend.json';
const siteMapBaseUrl = argv['sitemapbase'] || 'https://www.michas-ausflugstipps.de/mytb/de/';

export interface ServerConfig {
    frontendConfig: {
        cacheFolder: string,
    };
}

const serverConfig: ServerConfig = {
    frontendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' }))
};

const frontendConfig: ServerModuleConfig = {
    distServerProfile: distServerProfile,
    staticFolder: staticFolder,
    distProfile: distProfile,
    cacheFolder: serverConfig.frontendConfig.cacheFolder,
    cacheMode: CacheModeType.USE_CACHE
};

// Express server
const app = express();
const port = Math.floor(Math.random() * 10000 + 50000);
MytbAngularUniversalModule.configureDefaultServer(app, frontendConfig);
app.listen(port, function () {
    console.log('MyTB app listening on random port ' + port);
});

const siteBaseUrl = 'http://localhost:' + port + '/' + distProfile;
const defaultSiteMaps = [siteMapBaseUrl + 'sitemap-tdoc-de.xml', siteMapBaseUrl + 'sitemap-pdoc-de.xml'];
const siteUrls = [];
let notCached = 0;

const getsiteUrl = function (nr) {
    if (nr >= siteUrls.length) {
        process.exit(0);
        return;
    }

    const url = siteUrls[nr].toString();
    if (url.indexOf(siteBaseUrl) < 0) {
        console.warn('SKIP - illegal url:' + url);
    }
    return Axios(url).then(response => {
            if (response.status === 200) {
                console.log('DONE - ' + (nr + 1) + '/' + siteUrls.length + ' got cached url:' + url, response.status);
            } else {
                console.log('DONE - ' + (nr + 1) + '/' + siteUrls.length + ' got not cached url:' + url, response.status);
                notCached = notCached + 1;
                if (notCached >= maxNotCached) {
                    console.warn('WARNING - stopped after ' + (nr + 1) + '/' + siteUrls.length + ' with not cached:' + notCached, siteUrls);
                    process.exit(2);
                    return;
                }
            }
            return getsiteUrl(nr + 1);
        }).catch(error => {
            console.warn('WARNING - got error for url:' + url, error);
            return getsiteUrl(nr + 1);
        });
};

sitemaps.sitemapsInRobots(siteMapBaseUrl + 'robots.txt', function(err, siteMaps) {
    if (err) {
        console.error('error while parsing robots.txt', err);
        process.exit(2);
    }
    if (!siteMaps || siteMaps.length <= 0) {
       siteMaps = defaultSiteMaps;
    }

    sitemaps.parseSitemaps(siteMaps,
        function(url) {
            siteUrls.push(url.toString().replace(siteMapBaseUrl, siteBaseUrl));
        }, function(err2, siteMaps2) {
        if (err) {
            console.error('error while parsing sitemaps', err);
            process.exit(2);
        }

        console.log('parsed sitemaps:', siteMaps2);
        console.log('crawl urls:', siteUrls);

        // disable debug-logging
        if (!debug) {
            console.log('no debug mode - deactivate debug', debug);
            console.debug = function() {};
            console.log = function() {};
        }

        return getsiteUrl(0);
    });
});
