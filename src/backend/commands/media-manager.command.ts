import * as fs from 'fs';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {SDocMediaManagerModule} from '../modules/sdoc-media-manager.module';
import {utils} from 'js-data';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import * as os from 'os';
import {MediaManagerModule} from '../shared-node/media-commons/modules/media-manager.module';
import {CommonMediaManagerCommand} from '../shared-node/backend-commons/commands/common-media-manager.command';
import {AbstractCommand} from '../shared-node/backend-commons/commands/abstract.command';

export class MediaManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const searchForm = new SDocSearchForm({ type: 'image', sort: 'dateAsc'});
        const writable = backendConfig['sdocWritable'] === true || backendConfig['sdocWritable'] === 'true';
        const dataService = SDocDataServiceModule.getDataService('sdocSolrReadOnly', backendConfig);
        const action = argv['action'];
        const importDir = argv['importDir'];
        if (writable) {
            dataService.setWritable(true);
        }
        const mediaManagerModule = new MediaManagerModule(backendConfig['imageMagicAppPath'], os.tmpdir());
        const sdocManagerModule = new SDocMediaManagerModule(backendConfig, dataService, mediaManagerModule);
        const commonMediadManagerCommand = new CommonMediaManagerCommand(backendConfig);

        let promise: Promise<any>;
        switch (action) {
            case 'readImageDates':
                promise = sdocManagerModule.readImageDates(searchForm);

                break;
            case 'scaleImages':
                promise = sdocManagerModule.scaleImages(searchForm);

                break;
            case 'generateSDocsFromMediaDir':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR [-force true/false]');
                    return promise;
                }

                promise = sdocManagerModule.generateSDocRecordsFromMediaDir(importDir);
                promise.then(value => {
                    const responseMapper = new SDocAdapterResponseMapper(backendConfig);
                    const sdocs = [];
                    for (const sdoc of value) {
                        sdocs.push(responseMapper.mapToAdapterDocument({}, sdoc));
                    }
                    console.log(JSON.stringify({ sdocs: sdocs}, undefined, ' '));
                });

                break;
            default:
                return commonMediadManagerCommand.process(argv);
        }

        return promise;
    }
}
