import * as fs from 'fs';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {AbstractCommand} from './abstract.command';
import {RedirectConfig, RedirectGeneratorModule} from '../modules/redirect-generator.module';
import {utils} from 'js-data';

export class RedirectGeneratorCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const generatorConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'})),
        };
        const srcBaseUrl = argv['srcBaseUrl'] || '/mytb/de/';
        const destBaseUrl = argv['destBaseUrl'] || '/mytb/de/';
        const types = argv['types'] || 'track,route,location,trip,news';
        const profiles = argv['profiles'] || 'sdocShow';

        const promises: Promise<any>[] = [];
        for (const profile of profiles.split(',')) {
            // generate Redirects
            let redirectConfig: RedirectConfig;
            switch (profile) {
                case 'sdocShow':
                    redirectConfig = {
                        perPage: 100,
                        srcUrlPathGenerator: function (config: RedirectConfig, doc: PDocRecord): string[] {
                            return [srcBaseUrl + 'sections/start/show/redirect/' + doc.id,
                                srcBaseUrl + 'sections/start/show/unknown/' + doc.id,
                                srcBaseUrl + 'sections/start/show/nocomment/' + doc.id];
                        },
                        redirectGenerator: function (config: RedirectConfig, doc: PDocRecord): string {
                            const name = (doc.name ? doc.name : 'name')
                                .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
                                .replace(/ +/g, ' ').replace(/ /g, '-').trim();
                            return destBaseUrl + 'sections/start/show/' + name + '/' + doc.id;
                        }
                    };
                    break;
                default:
                    return utils.reject('ERROR - unknown profile to generate redirects for: ' + profile);
            }

            const promise = RedirectGeneratorModule.generateRedirectFiles(
                SDocDataServiceModule.getDataService('sdocSolrReadOnly', generatorConfig.backendConfig),
                redirectConfig,
                new SDocSearchForm({'type': types})
            );
            promises.push(promise);
        }

        return Promise.all(promises);
    }
}
