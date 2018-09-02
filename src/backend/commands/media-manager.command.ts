import * as fs from 'fs';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocMediaManagerModule} from '../modules/tdoc-media-manager.module';
import {utils} from 'js-data';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import * as os from 'os';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {CommonMediaManagerCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-media-manager.command';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';

export class MediaManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc'});
        const writable = backendConfig['tdocWritable'] === true || backendConfig['tdocWritable'] === 'true';
        const dataService = TourDocDataServiceModule.getDataService('tdocSolrReadOnly', backendConfig);
        const action = argv['action'];
        const importDir = argv['importDir'];
        if (writable) {
            dataService.setWritable(true);
        }
        const mediaManagerModule = new MediaManagerModule(backendConfig['imageMagicAppPath'], os.tmpdir());
        const tdocManagerModule = new TourDocMediaManagerModule(backendConfig, dataService, mediaManagerModule);
        const commonMediadManagerCommand = new CommonMediaManagerCommand(backendConfig);

        let promise: Promise<any>;
        switch (action) {
            case 'readImageDates':
                promise = tdocManagerModule.readImageDates(searchForm);

                break;
            case 'scaleImages':
                promise = tdocManagerModule.scaleImages(searchForm);

                break;
            case 'generateTourDocsFromMediaDir':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR [-force true/false]');
                    return promise;
                }

                promise = tdocManagerModule.generateTourDocRecordsFromMediaDir(importDir);
                promise.then(value => {
                    const responseMapper = new TourDocAdapterResponseMapper(backendConfig);
                    const tdocs = [];
                    for (const tdoc of value) {
                        tdocs.push(responseMapper.mapToAdapterDocument({}, tdoc));
                    }
                    console.log(JSON.stringify({ tdocs: tdocs}, undefined, ' '));
                });

                break;
            default:
                return commonMediadManagerCommand.process(argv);
        }

        return promise;
    }
}
