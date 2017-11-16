import * as fs from 'fs';
import {SitemapConfig, SitemapGeneratorModule} from '../modules/sitemap-generator.module';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {PDocSearchForm} from '../shared/pdoc-commons/model/forms/pdoc-searchform';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {PDocDataServiceModule} from '../modules/pdoc-dataservice.module';
import {AbstractCommand} from './abstract.command';

export class SiteMapGeneratorCommand implements AbstractCommand {
    public process(argv): void {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const filePathSitemapConfigJson = argv['s'] || argv['sitemap'] || argv['_'][0];
        const generatorConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'})),
            sitemapConfig: JSON.parse(fs.readFileSync(filePathSitemapConfigJson, {encoding: 'utf8'}))
        };

        // generate SiteMap
        let sitemapConfig = Object.assign({}, generatorConfig.sitemapConfig, {
            fileBase: 'sitemap-sdoc-',
            showBaseUrl: generatorConfig.sitemapConfig.showBaseUrl + 'sections/start/show/',
            urlGenerator: function (config: SitemapConfig, doc: PDocRecord): string[] {
                const name = (doc.name ? doc.name : 'name')
                    .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
                    .replace(/ +/g, ' ').replace(/ /g, '-').trim();
                return [config.showBaseUrl + name + '/' + doc.id];
            }
        });
        SitemapGeneratorModule.generateSiteMapFiles(
            SDocDataServiceModule.getDataService('sdocSolrReadOnly', generatorConfig.backendConfig, true),
            sitemapConfig,
            new SDocSearchForm(sitemapConfig.sdocSearchForm)
        );

        sitemapConfig = Object.assign({}, generatorConfig.sitemapConfig, {
            fileBase: 'sitemap-pdoc-',
            showBaseUrl: generatorConfig.sitemapConfig.showBaseUrl + 'sections/',
            urlGenerator: function (config: SitemapConfig, doc: PDocRecord): string[] {
                return [config.showBaseUrl + doc.id,
                    //    config.showBaseUrl + doc.id + '/search/jederzeit/ueberall/alles/egal/ungefiltert/ratePers/route,location/10/1'
                ];
            }
        });
        SitemapGeneratorModule.generateSiteMapFiles(
            PDocDataServiceModule.getDataService('pdocSolr' + sitemapConfig.locale + 'ReadOnly', generatorConfig.backendConfig,
                sitemapConfig.locale, true),
            sitemapConfig,
            new PDocSearchForm({})
        );

    }
}
