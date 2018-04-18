import {AbstractCommand} from './abstract.command';
import * as fs from 'fs';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {SDocFileUtils} from '../shared/sdoc-commons/services/sdoc-file.utils';
import {Mapper, utils} from 'js-data';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';

export class SDocLoaderCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const perRun = 1;
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
        const recordSrcs = SDocFileUtils.parseRecordSourceFromJson(fs.readFileSync(dataFileName, { encoding: 'utf8' }));

        const dataService: SDocDataService = SDocDataServiceModule.getDataService('sdocSolr', serverConfig.backendConfig);
        dataService.setWritable(true);
        const mapper: Mapper = dataService.getMapper('sdoc');
        const responseMapper = new SDocAdapterResponseMapper(serverConfig.backendConfig);

        let records = [];
        const recordsPerType = {};
        for (const sdocSrc of recordSrcs) {
            const sdoc: SDocRecord = <SDocRecord>responseMapper.mapResponseDocument(mapper, sdocSrc, {});
            const type = sdoc.type.toLowerCase();
            if (!recordsPerType.hasOwnProperty(type)) {
                recordsPerType[type] = [];
            }
            recordsPerType[type].push(sdoc);
        }
        for (const type of typeOrder) {
            if (recordsPerType[type]) {
                records = records.concat(recordsPerType[type]);
            }
        }

        const recordIdMapping = {};
        const recordRecoverIdMapping = {};

        let newRecords = [];
        const readUpdateOrInsert = function(start): Promise<any> {
            const chunk = records.slice(start, start + perRun);
            const promises = chunk.map(sdoc => {
                return dataService.importRecord(sdoc, recordIdMapping, recordRecoverIdMapping)
                    .then(function recordsDone(newSdocRecord: SDocRecord) {
                        console.log('DONE - import newrecord', newSdocRecord.id);
                        return utils.resolve(newSdocRecord);
                    }).catch(function onError(error) {
                        console.error('error thrown while importRecord SDoc: ', error);
                        return utils.reject(error);
                    });
            });
            const results = Promise.all(promises);

            return results.then(data => {
                newRecords = newRecords.concat(data);
                console.log('DONE - chunk pos:' + (start + 1) + '/' + records.length);
                if (start + perRun > records.length) {
                    console.log('DONE - load sdocs');
                    return utils.resolve('WELL DONE');
                } else {
                    return readUpdateOrInsert(start + perRun);
                }
            }).catch(errors => {
                console.error('error thrown: ', errors);
                return utils.reject(errors);
            });
        };

        let finishedRecords = [];
        const updateRecoverIds = function(start): Promise<any> {
            const chunk = newRecords.slice(start, start + perRun);
            const promises = chunk.map(sdoc => {
                return dataService.postProcessImportRecord(sdoc, recordIdMapping, recordRecoverIdMapping)
                    .then(function onDone(newSdocRecord: SDocRecord) {
                        console.log('DONE - postprocess newrecord', newSdocRecord.id);
                        return utils.resolve(newSdocRecord);
                    }).catch(function onError(error) {
                        console.error('error thrown while postProcessImportRecord SDoc: ', error);
                        return utils.reject(error);
                    });
            });
            const results = Promise.all(promises);

            return results.then(data => {
                finishedRecords = finishedRecords.concat(data);
                console.log('DONE - chunk pos:' + (start + 1) + '/' + records.length);
                if (start + perRun > records.length) {
                    console.log('DONE - postprocess sdocs', finishedRecords);
                    return utils.resolve('WELL DONE');
                } else {
                    return updateRecoverIds(start + perRun);
                }
            }).catch(errors => {
                console.error('error thrown: ', errors);
                return utils.reject(errors);
            });
        };

        return readUpdateOrInsert(0).then(function onFullFilled() {
            return updateRecoverIds(0);
        });
    }
}
