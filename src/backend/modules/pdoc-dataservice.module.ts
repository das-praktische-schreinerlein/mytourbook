import {PDocDataStore} from '../shared/pdoc-commons/services/pdoc-data.store';
import {SearchParameterUtils} from '../shared/search-commons/services/searchparameter.utils';
import {PDocDataService} from '../shared/pdoc-commons/services/pdoc-data.service';
import {PDocInMemoryAdapter} from '../shared/pdoc-commons/services/pdoc-inmemory.adapter';
import {PDocRecord} from '../shared/pdoc-commons/model/records/pdoc-record';
import * as fs from 'fs';
import marked from 'marked';
import htmlToText from 'html-to-text';

export class PDocDataServiceModule {
    private static dataServices = new Map<string, PDocDataService>();

    public static getDataService(profile: string, backendConfig: {}, locale: string, readOnly: boolean): PDocDataService {
        if (!this.dataServices.has(profile)) {
            this.dataServices.set(profile, PDocDataServiceModule.createDataService(backendConfig, locale, readOnly));
        }

        return this.dataServices.get(profile);
    }

    private static createDataService(backendConfig: {}, locale: string, readOnly: boolean): PDocDataService {
        // configure store
        const dataStore: PDocDataStore = new PDocDataStore(new SearchParameterUtils());
        const dataService: PDocDataService = new PDocDataService(dataStore);
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: true
        });

        const fileName = backendConfig['filePathPDocJson'].replace('.json', '-' + locale + '.json');
        const docs: any[] = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf8' })).pdocs;
        for (const doc of docs) {
            if (!doc['descHtml']) {
                doc['descHtml'] = marked(doc['descMd']);
            }
            if (!doc['descTxt']) {
                doc['descTxt'] = htmlToText.fromString(doc['descHtml'], {
                    wordwrap: 80
                });
            }
        }
        dataService.addMany(docs).then(function doneAddMany(records: PDocRecord[]) {
                console.log('loaded pdocs from assets', records);
            },
            function errorCreate(reason: any) {
                console.error('loading pdocs failed:' + reason);
            }
        );

        // configure dummy-adapter
        const options = {};
        const adapter = new PDocInMemoryAdapter(options);
        dataStore.setAdapter('inmemory', adapter, '', {});

        return dataService;
    }
}
