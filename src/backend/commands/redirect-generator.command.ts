import * as fs from 'fs';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {AbstractCommand} from './abstract.command';
import {RedirectConfig, RedirectGeneratorModule} from '../modules/redirect-generator.module';

export class RedirectGeneratorCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const generatorConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'})),
        };
        const baseUrl = argv['baseUrl'] || 'https://www.michas-ausflugstipps.de/mytb/de/';
        const types = argv['types'] || 'track,route,location,trip,news';

        // generate Redirects
        const redirectConfig: RedirectConfig = {
            baseUrl: baseUrl,
            perPage: 100,
            srcUrlPathGenerator: function (config: RedirectConfig, doc: PDocRecord): string[] {
                return [baseUrl + 'sections/start/show/redirect/' + doc.id,
                    baseUrl + 'sections/start/show/unknown/' + doc.id,
                    baseUrl + 'sections/start/show/nocomment/' + doc.id];
            },
            redirectGenerator: function (config: RedirectConfig, doc: PDocRecord): string {
                const name = (doc.name ? doc.name : 'name')
                    .replace(/[^-a-zA-Z0-9.+]+/g, ' ')
                    .replace(/ +/g, ' ').replace(/ /g, '-').trim();
                return baseUrl + 'sections/start/show/' + name + '/' + doc.id;
            }
        };

        return RedirectGeneratorModule.generateRedirectFiles(
            SDocDataServiceModule.getDataService('sdocSolrReadOnly', generatorConfig.backendConfig),
            redirectConfig,
            new SDocSearchForm({'type': types})
        );
    }
}
