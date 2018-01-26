import {AbstractCommand} from './abstract.command';
import * as fs from 'fs';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {SDocFileUtils} from '../shared/sdoc-commons/services/sdoc-file.utils';
import {Adapter} from 'js-data-adapter';
import {GenericSearchOptions} from '../shared/search-commons/services/generic-search.service';
import {Mapper, utils} from 'js-data';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';

export class SDocLoaderCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const perRun = 1;
        const defaultLocIdParent = 1;
        const typeMapping = {
            image: 'imageId',
            track: 'trackId',
            location: 'locId',
            route: 'routeId',
            trip: 'tripId',
            news: 'newsId'
        };
        const idMappings = ['locId', 'routeId', 'trackId', 'tripId', 'newsId', 'imageId'];
        const typeOrder = ['location', 'news', 'trip', 'route', 'track', 'image'];

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
        const adapter: Adapter = dataService.getAdapterForMapper('sdoc');
        const responseMapper = new SDocAdapterResponseMapper();

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

        const searchOptions: GenericSearchOptions = {
            showForm: false,
            loadTrack: false,
            showFacets: false
        };

        const recordIdMapping = {};

        const getByName = function(record: SDocRecord): Promise<SDocRecord> {
            const query = {
                where: {
                    name_s: {
                        'in': [record.name]
                    },
                    type_txt: {
                        'in': [record.type.toLowerCase()]
                    }
                }
            };
            const opts = {};

            for (const idFieldName of idMappings) {
                if (recordIdMapping[idFieldName] && recordIdMapping[idFieldName][record[idFieldName]]) {
                    console.log('map ref ' + idFieldName + ' ' + record[idFieldName]
                        + '->' + recordIdMapping[idFieldName][record[idFieldName]]);
                    record[idFieldName] = recordIdMapping[idFieldName][record[idFieldName]];
                }
            }
            if (record.type.toLowerCase() === 'location' && record.locIdParent === undefined) {
                record.locIdParent = defaultLocIdParent;
            }

            return adapter.findAll(mapper, query, opts).then(searchResult => {
                    console.log('READ - record' + record.name, searchResult);
                    if (!searchResult || searchResult.length <= 0) {
                        return utils.resolve(undefined);
                    }
                    return utils.resolve(searchResult[0]);
                }).then(function recordsDone(sdocRecord: SDocRecord) {
                    console.log('RESULT - record', sdocRecord);
                    if (sdocRecord === undefined) {
                        console.log('ADD - record', record);
                        return dataService.add(record);
                    }

                    console.log('EXISTING - record', record.name);
                    return utils.resolve(sdocRecord);
                    //console.log('UPDATE - record', record.name);
                    //return dataService.updateById(sdocRecord.id, record);
                }).then(function recordsDone(newSdocRecord: SDocRecord) {
                    console.log('DONE - newrecord', newSdocRecord.id);
                    const idFieldName = typeMapping[record.type.toLowerCase()];
                    if (!recordIdMapping.hasOwnProperty(idFieldName)) {
                        recordIdMapping[idFieldName] = {};
                    }
                    console.log('map id ' + idFieldName + ' ' + record[idFieldName] + '->' + newSdocRecord[idFieldName]);
                    recordIdMapping[idFieldName][record[idFieldName]] = newSdocRecord[idFieldName];
                    return utils.resolve(newSdocRecord);
                }).catch(function searchError(error) {
                    console.error('error thrown: ', error);
                    return utils.reject(error);
                }
            );
        };

        const readUpdateOrInsert = function(start): Promise<any> {
            console.log('RUN - load sdocs for chunk pos:' + (start + 1) + '/' + records.length);
            const chunk = records.slice(start, start + perRun);
            const promises = chunk.map(sdoc => {
                return getByName(sdoc);

            });
            const results = Promise.all(promises);

            return results.then(data => {
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

        return readUpdateOrInsert(0);
    }
}
