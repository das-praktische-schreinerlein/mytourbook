import * as fs from 'fs';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {RedirectConfig, RedirectGeneratorModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/redirect-generator.module';
import {utils} from 'js-data';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

export class RedirectGeneratorCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const generatorConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'})),
        };
        const srcBaseUrl = argv['srcBaseUrl'] || '/mytb/de/';
        const destBaseUrl = argv['destBaseUrl'] || '/mytb/de/';
        const types = argv['types'] || 'track,route,location,trip,news';
        const profiles = argv['profiles'] || 'tdocShow';

        const promises: Promise<any>[] = [];
        for (const profile of profiles.split(',')) {
            // generate Redirects
            let redirectConfig: RedirectConfig;
            if (profile === 'tdocShow') {
                redirectConfig = {
                    perPage: 100,
                    srcUrlPathGenerator: function (config: RedirectConfig, doc: PDocRecord): string[] {
                        return [srcBaseUrl + 'sections/start/show/redirect/' + doc.id,
                            srcBaseUrl + 'sections/start/show/unknown/' + doc.id,
                            srcBaseUrl + 'sections/start/show/nocomment/' + doc.id];
                    },
                    redirectGenerator: function (config: RedirectConfig, doc: PDocRecord): string {
                        const name = StringUtils.generateTechnicalName(doc.name ? doc.name : 'name');
                        return destBaseUrl + 'sections/start/show/' + name + '/' + doc.id;
                    }
                };
            } else {
                return utils.reject('ERROR - unknown profile to generate redirects for: ' + profile);
            }

            const dataservice: CommonDocDataService<CommonDocRecord, CommonDocSearchForm,
                CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>> =
                    TourDocDataServiceModule.getDataService('tdocSolrReadOnly', generatorConfig.backendConfig);

            const promise = RedirectGeneratorModule.generateRedirectFiles(
                dataservice.getSearchService(),
                redirectConfig,
                dataservice.newSearchForm({'type': types})
            );
            promises.push(promise);
        }

        return Promise.all(promises);
    }
}
