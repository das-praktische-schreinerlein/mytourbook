import {AbstractCommand} from '../shared-node/backend-commons/commands/abstract.command';
import * as fs from 'fs';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {SDocFileUtils} from '../shared/sdoc-commons/services/sdoc-file.utils';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import {CommonDocRecord} from '../shared/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../shared/search-commons/model/forms/cdoc-searchform';
import {CommonDocDataService} from '../shared/search-commons/services/cdoc-data.service';
import {CommonDocSearchResult} from '../shared/search-commons/model/container/cdoc-searchresult';
import {GenericAdapterResponseMapper} from '../shared/search-commons/services/generic-adapter-response.mapper';
import {CommonDocTransportModule} from '../shared-node/backend-commons/modules/cdoc-transport.module';

export class SDocLoaderCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const typeOrder = ['location', 'news', 'trip', 'route', 'track', 'image', 'video'];

        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const serverConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
            readOnly: false
        };

        const dataFileName = argv['f'] || argv['file'];
        if (dataFileName === undefined) {
            console.error('option --file expected');
            return;
        }

        const dataService: CommonDocDataService<CommonDocRecord, CommonDocSearchForm,
            CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>> =
            SDocDataServiceModule.getDataService('sdocSolr', serverConfig.backendConfig);
        dataService.setWritable(true);
        const responseMapper: GenericAdapterResponseMapper = new SDocAdapterResponseMapper(serverConfig.backendConfig);
        const transporter: CommonDocTransportModule = new CommonDocTransportModule();

        const recordSrcs = SDocFileUtils.parseRecordSourceFromJson(fs.readFileSync(dataFileName, { encoding: 'utf8' }));
        return transporter.loadDocs(recordSrcs, typeOrder, responseMapper, dataService);
    }
}
