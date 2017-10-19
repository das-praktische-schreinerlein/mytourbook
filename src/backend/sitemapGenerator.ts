import * as fs from 'fs';
import {SitemapConfig, SitemapGeneratorModule} from './modules/sitemap-generator.module';
import {SDocSearchForm} from './shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocServerModule} from './modules/sdoc-server.module';
import minimist from 'minimist';
import {PDocServerModule} from './modules/pdoc-server.module';
import {PDocSearchForm} from './shared/pdoc-commons/model/forms/pdoc-searchform';
import {PDocRecord} from './shared/pdoc-commons/model/records/pdoc-record';

// disable debug-logging
const debug = false;
if (!debug) {
    console.debug = function() {};
    console.log = function() {};
}

const argv = minimist(process.argv.slice(2));

const filePathConfigJson = 'config/backend.json';
const filePathSitemapConfigJson = argv['_'][0];
const generatorConfig = {
    backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
    sitemapConfig: JSON.parse(fs.readFileSync(filePathSitemapConfigJson, { encoding: 'utf8' }))
};

// generate SiteMap
let sitemapConfig = Object.assign({}, generatorConfig.sitemapConfig, {
    fileBase: 'sitemap-sdoc-',
    showBaseUrl: generatorConfig.sitemapConfig.showBaseUrl + 'sections/start/show/',
    urlGenerator: function(config: SitemapConfig, doc: PDocRecord): string[] {
        const name = (doc.name ? doc.name : 'name')
            .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
            .replace(/ +/g, ' ').replace(/ /g, '-').trim();
        return [config.showBaseUrl + name + '/' + doc.id];
    }
});
SitemapGeneratorModule.generateSiteMapFiles(
    SDocServerModule.getDataService(generatorConfig.backendConfig),
    sitemapConfig,
    new SDocSearchForm({})
);
sitemapConfig = Object.assign({}, generatorConfig.sitemapConfig, {
    fileBase: 'sitemap-pdoc-',
    showBaseUrl: generatorConfig.sitemapConfig.showBaseUrl + 'sections/',
    urlGenerator: function(config: SitemapConfig, doc: PDocRecord): string[] {
        return [config.showBaseUrl + doc.id, config.showBaseUrl + doc.id + '/search/'];
    }
});
SitemapGeneratorModule.generateSiteMapFiles(
    PDocServerModule.getDataService(generatorConfig.backendConfig, sitemapConfig.locale),
    sitemapConfig,
    new PDocSearchForm({})
);

