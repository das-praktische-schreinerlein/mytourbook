import * as fs from 'fs';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {CommonDocTransportModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-transport.module';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';

export class TourDocExporterCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            backend: new SimpleConfigFilePathValidationRule(true),
            file: new SimpleFilePathValidationRule(true),
            renameFileIfExists: new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return ['exportDocs'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const perRun = 999;
        const typeOrder = ['location', 'playlist', 'info', 'poi', 'news', 'trip', 'route', 'track', 'image', 'video'];

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

        const dataService: TourDocDataService =
            TourDocDataServiceModule.getDataService('tdocSolr', serverConfig.backendConfig);
        dataService.setWritable(false);
        const responseMapper: GenericAdapterResponseMapper = new TourDocAdapterResponseMapper(serverConfig.backendConfig);
        const writerCallback = function (output) {
            fs.appendFileSync(dataFileName, output);
        };
        const transporter: CommonDocTransportModule = new CommonDocTransportModule();

        const renameFileIfExists = !!argv['renameFileIfExists'];
        let fileCheckPromise: Promise<any>;
        if (fs.existsSync(dataFileName)) {
            if (!renameFileIfExists) {
                return Promise.reject('exportfile already exists');
            }

            const newFile = dataFileName + '.' + DateUtils.formatToFileNameDate(new Date(), '', '-', '') + '-export.MOVED';
            fileCheckPromise = FileUtils.moveFile(dataFileName, newFile, false, true, false);
        } else {
            fileCheckPromise = Promise.resolve();
        }

        return fileCheckPromise.then(() => {
            fs.writeFileSync(dataFileName, '{"tdocs": [');
            return transporter.exportDocs(typeOrder, perRun, writerCallback, responseMapper, dataService).then(value => {
                writerCallback(']}');
                return Promise.resolve(value);
            });
        }).catch(reason => {
            return Promise.reject('exportfile already exists and cant be renamed: ' + reason);
        })

    }
}
