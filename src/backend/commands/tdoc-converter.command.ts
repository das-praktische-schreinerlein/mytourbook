import * as fs from 'fs';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocImportConverterModule} from '../modules/tdoc-converter.module';
import {TourDocSolrAdapter} from '../shared/tdoc-commons/services/tdoc-solr.adapter';
import {ValidationRule, WhiteListValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {
    CommonAdminCommand,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';

export class TourDocConverterCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            backend: new SimpleConfigFilePathValidationRule(true),
            srcFile: new SimpleFilePathValidationRule(true),
            file: new SimpleFilePathValidationRule(true),
            renameFileIfExists: new WhiteListValidationRule(false, [true, false, 'true', 'false'], false),
            mode: new WhiteListValidationRule(true, ['SOLR', 'RESPONSE'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return ['convertGeoJsonToTourDoc'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const writable = backendConfig['tdocWritable'] === true || backendConfig['tdocWritable'] === 'true';
        const dataService = TourDocDataServiceModule.getDataService('tdocSolrReadOnly', backendConfig);
        const action = argv['action'];
        if (writable) {
            dataService.setWritable(true);
        }

        const tdocConverterModule = new TourDocImportConverterModule(backendConfig, dataService);

        let promise: Promise<any>;
        switch (action) {
            case 'convertGeoJsonToTourDoc':
                const dataFileName = TourDocFileUtils.normalizeCygwinPath(argv['file']);
                if (dataFileName === undefined) {
                    return Promise.reject('option --file expected');
                }

                const srcFile = TourDocFileUtils.normalizeCygwinPath(argv['srcFile']);
                if (srcFile === undefined) {
                    console.error(srcFile + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    return Promise.reject(srcFile + ' missing parameter - usage: --srcFile SRCFILE');
                }

                const mode = argv['mode'];
                if (mode === undefined || (mode !== 'SOLR' && mode !== 'RESPONSE')) {
                    console.error(mode + ' missing parameter - usage: --mode SOLR|RESPONSE', argv);
                    return Promise.reject(mode + ' missing parameter - usage: --mode SOLR|RESPONSE');
                }

                const renameFileIfExists = !!argv['renameFileIfExists'];
                let fileCheckPromise: Promise<any>;
                if (fs.existsSync(dataFileName)) {
                    if (!renameFileIfExists) {
                        return Promise.reject('exportfile already exists');
                    }

                    const newFile = dataFileName + '.' + DateUtils.formatToFileNameDate(new Date(), '', '-', '') + '-export.MOVED';
                    fileCheckPromise = FileUtils.moveFile(dataFileName, newFile, false);
                } else {
                    fileCheckPromise = Promise.resolve();
                }

                promise = fileCheckPromise.then(() => {
                    return tdocConverterModule.convertGeoJSONOTourDoc(srcFile).then(value => {
                        const responseMapper = new TourDocAdapterResponseMapper(backendConfig);
                        const solrAdapter = new TourDocSolrAdapter({});
                        const tdocs = [];
                        for (const tdoc of value) {
                            if (mode === 'SOLR') {
                                tdocs.push(solrAdapter.mapToAdapterDocument(tdoc));
                            } else {
                                tdocs.push(responseMapper.mapToAdapterDocument({}, tdoc));
                            }
                        }

                        fs.writeFileSync(dataFileName, JSON.stringify({ tdocs: tdocs}, undefined, ' '));
                    }).catch(reason => {
                        console.error('something went wrong:', reason);
                        return Promise.reject(reason);
                    });
                }).catch(reason => {
                    return Promise.reject('exportfile already exists and cant be renamed: ' + reason);
                })

                break;
            default:
                console.error('unknown action:', argv);
                return Promise.reject('unknown action');
        }

        return promise;
    }
}
