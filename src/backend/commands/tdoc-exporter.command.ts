import * as fs from 'fs';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {CommonDocTransportModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-transport.module';
import {utils} from 'js-data';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {
    CommonAdminCommand,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {ValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class TourDocExporterCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            backend: new SimpleConfigFilePathValidationRule(true),
            file: new SimpleFilePathValidationRule(true)
        };
    }

    protected definePossibleActions(): string[] {
        return ['exportDocs'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const perRun = 999;
        const typeOrder = ['location', 'news', 'trip', 'route', 'track', 'image', 'video'];

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const serverConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
            readOnly: false
        };

        const dataFileName = TourDocFileUtils.normalizeCygwinPath(argv['file']);
        if (dataFileName === undefined) {
            return Promise.reject('option --file expected');
        }

        const dataService: CommonDocDataService<CommonDocRecord, CommonDocSearchForm,
            CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>> =
            TourDocDataServiceModule.getDataService('tdocSolr', serverConfig.backendConfig);
        dataService.setWritable(false);
        const responseMapper: GenericAdapterResponseMapper = new TourDocAdapterResponseMapper(serverConfig.backendConfig);
        const writerCallback = function (output) {
            fs.appendFileSync(dataFileName, output);
        };
        const transporter: CommonDocTransportModule = new CommonDocTransportModule();

        fs.writeFileSync(dataFileName, '{"tdocs": [');
        return transporter.exportDocs(typeOrder, perRun, writerCallback, responseMapper, dataService).then(value => {
            writerCallback(']}');
            return utils.resolve(value);
        });
    }
}
