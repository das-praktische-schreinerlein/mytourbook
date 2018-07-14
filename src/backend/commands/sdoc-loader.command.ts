import {AbstractCommand} from './abstract.command';
import * as fs from 'fs';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {SDocFileUtils} from '../shared/sdoc-commons/services/sdoc-file.utils';
import {Mapper, utils} from 'js-data';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import {CommonDocRecord} from '../shared/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../shared/search-commons/model/forms/cdoc-searchform';
import {CommonDocDataService} from '../shared/search-commons/services/cdoc-data.service';
import {CommonDocSearchResult} from '../shared/search-commons/model/container/cdoc-searchresult';
import {GenericAdapterResponseMapper} from '../shared/search-commons/services/generic-adapter-response.mapper';

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

        const dataService: CommonDocDataService<CommonDocRecord, CommonDocSearchForm,
            CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>> =
            SDocDataServiceModule.getDataService('sdocSolr', serverConfig.backendConfig);
        dataService.setWritable(true);
        const mapper: Mapper = dataService.getMapper(dataService.getBaseMapperName());
        const responseMapper: GenericAdapterResponseMapper = new SDocAdapterResponseMapper(serverConfig.backendConfig);

        let records = [];
        const recordsPerType = {};
        for (const docSrc of recordSrcs) {
            const doc: CommonDocRecord = <CommonDocRecord>responseMapper.mapResponseDocument(mapper, docSrc, {});
            const type = doc.type.toLowerCase();
            if (!recordsPerType.hasOwnProperty(type)) {
                recordsPerType[type] = [];
            }
            recordsPerType[type].push(doc);
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
            const promises = chunk.map(doc => {
                return dataService.importRecord(doc, recordIdMapping, recordRecoverIdMapping)
                    .then(function recordsDone(newDocRecord: CommonDocRecord) {
                        console.log('DONE - import newrecord', newDocRecord.id);
                        return utils.resolve(newDocRecord);
                    }).catch(function onError(error) {
                        console.error('error thrown while importRecord Doc: ', error);
                        return utils.reject(error);
                    });
            });
            const results = Promise.all(promises);

            return results.then(data => {
                newRecords = newRecords.concat(data);
                console.log('DONE - chunk pos:' + (start + 1) + '/' + records.length);
                if (start + perRun > records.length) {
                    console.log('DONE - load docs');
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
            const promises = chunk.map(doc => {
                return dataService.postProcessImportRecord(doc, recordIdMapping, recordRecoverIdMapping)
                    .then(function onDone(newDocRecord: CommonDocRecord) {
                        console.log('DONE - postprocess newrecord', newDocRecord.id);
                        return utils.resolve(newDocRecord);
                    }).catch(function onError(error) {
                        console.error('error thrown while postProcessImportRecord Doc: ', error);
                        return utils.reject(error);
                    });
            });
            const results = Promise.all(promises);

            return results.then(data => {
                finishedRecords = finishedRecords.concat(data);
                console.log('DONE - chunk pos:' + (start + 1) + '/' + records.length);
                if (start + perRun > records.length) {
                    console.log('DONE - postprocess docs', finishedRecords);
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
