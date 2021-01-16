import * as fs from 'fs';
import {SitemapConfig, SitemapGeneratorModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/sitemap-generator.module';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {PDocDataServiceModule} from '../modules/pdoc-dataservice.module';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {
    CommonAdminCommand,
    SimpleConfigFilePathValidationRule
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {ValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class SiteMapGeneratorCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            backend: new SimpleConfigFilePathValidationRule(true),
            sitemap: new SimpleConfigFilePathValidationRule(true)
        };
    }

    protected definePossibleActions(): string[] {
        return ['generateSitemap'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const filePathConfigJson = argv['backend'];
        const filePathSitemapConfigJson = argv['sitemap'];
        if (filePathConfigJson === undefined || filePathSitemapConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend" sitemapConfig: "--sitemap"');
        }

        const generatorConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'})),
            sitemapConfig: JSON.parse(fs.readFileSync(filePathSitemapConfigJson, {encoding: 'utf8'}))
        };

        // generate SiteMap
        let sitemapConfig = Object.assign({}, generatorConfig.sitemapConfig, {
            fileBase: 'sitemap-tdoc-',
            showBaseUrl: generatorConfig.sitemapConfig.showBaseUrl + 'sections/start/show/',
            urlGenerator: function (config: SitemapConfig, doc: PDocRecord): string[] {
                const name = StringUtils.generateTechnicalName(doc.name ? doc.name : 'name');
                return [config.showBaseUrl + name + '/' + doc.id];
            }
        });

        const dataservice: CommonDocDataService<CommonDocRecord, CommonDocSearchForm,
        CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>> =
            TourDocDataServiceModule.getDataService('tdocSolrReadOnly', generatorConfig.backendConfig);

        return SitemapGeneratorModule.generateSiteMapFiles(
            dataservice.getSearchService(),
            sitemapConfig,
            dataservice.newSearchForm(sitemapConfig.tdocSearchForm)
        ).then(value => {
            sitemapConfig = Object.assign({}, generatorConfig.sitemapConfig, {
                fileBase: 'sitemap-pdoc-',
                showBaseUrl: generatorConfig.sitemapConfig.showBaseUrl + 'sections/',
                urlGenerator: function (config: SitemapConfig, doc: PDocRecord): string[] {
                    return [config.showBaseUrl + doc.id,
                        //    config.showBaseUrl + doc.id + '/search/jederzeit/ueberall/alles/egal/ungefiltert/ratePers/route,location/10/1'
                    ];
                }
            });
            return SitemapGeneratorModule.generateSiteMapFiles(
                PDocDataServiceModule.getDataService('pdocSolr' + sitemapConfig.locale + 'ReadOnly', generatorConfig.backendConfig,
                    sitemapConfig.locale),
                sitemapConfig,
                new PDocSearchForm({})
            );
        });
    }
}
