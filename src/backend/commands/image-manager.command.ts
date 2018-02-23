import * as fs from 'fs';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {AbstractCommand} from './abstract.command';
import {ImageManagerModule} from '../modules/image-manager.module';
import {utils} from 'js-data';

export class ImageManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const searchForm = new SDocSearchForm({ type: 'image', sort: 'date'});
        const writable = backendConfig['sdocWritable'] === true || backendConfig['sdocWritable'] === 'true';
        const dataService = SDocDataServiceModule.getDataService('sdocSolrReadOnly', backendConfig);
        if (writable) {
            dataService.setWritable(true);
        }
        const imageManagerModule = new ImageManagerModule(backendConfig, dataService);

        let promise: Promise<any>;
        switch (argv['action']) {
            case 'readImageDates':
                promise = imageManagerModule.readImageDates(searchForm);

                break;
            case 'scaleImages':
                promise = imageManagerModule.scaleImages(searchForm);

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }
}
