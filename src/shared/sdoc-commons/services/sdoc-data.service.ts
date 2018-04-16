import {SDocRecord, SDocRecordRelation} from '../model/records/sdoc-record';
import {SDocDataStore} from './sdoc-data.store';
import {SDocSearchService} from './sdoc-search.service';
import {SDocImageRecord, SDocImageRecordRelation} from '../model/records/sdocimage-record';
import {SDocImageRecordSchema} from '../model/schemas/sdocimage-record-schema';
import {SDocRecordSchema} from '../model/schemas/sdoc-record-schema';
import {SDocRateTechRecord, SDocRateTechRecordRelation} from '../model/records/sdocratetech-record';
import {SDocDataTechRecordSchema} from '../model/schemas/sdocdatatech-record-schema';
import {SDocDataTechRecord, SDocDataTechRecordRelation} from '../model/records/sdocdatatech-record';
import {SDocRateTechRecordSchema} from '../model/schemas/sdocratetech-record-schema';
import {SDocRatePersonalRecordSchema} from '../model/schemas/sdocratepers-record-schema';
import {SDocRatePersonalRecord, SDocRatePersonalRecordRelation} from '../model/records/sdocratepers-record';
import {SDocDataInfoRecord, SDocDataInfoRecordRelation} from '../model/records/sdocdatainfo-record';
import {SDocDataInfoRecordSchema} from '../model/schemas/sdocdatainfo-record-schema';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {Mapper, utils} from 'js-data';
import {Adapter} from 'js-data-adapter';
import {SDocVideoRecord, SDocVideoRecordRelation} from '../model/records/sdocvideo-record';
import {SDocVideoRecordSchema} from '../model/schemas/sdocvideo-record-schema';

export class SDocDataService extends SDocSearchService {
    private responseMapper: SDocAdapterResponseMapper;
    private writable = false;

    public defaultLocIdParent = 1;
    public typeMapping = {
        image: 'imageId',
        video: 'videoId',
        track: 'trackId',
        location: 'locId',
        route: 'routeId',
        trip: 'tripId',
        news: 'newsId'
    };
    public idMappings = ['locId', 'locIdParent', 'routeId', 'trackId', 'tripId', 'newsId', 'imageId', 'videoId'];
    public idMappingAliases = {
        'locIdParent': 'locId'
    };

    constructor(dataStore: SDocDataStore) {
        super(dataStore);
        this.responseMapper = new SDocAdapterResponseMapper({});
        this.dataStore.defineMapper('sdoc', SDocRecord, SDocRecordSchema, SDocRecordRelation);
        this.dataStore.defineMapper('sdocdatatech', SDocDataTechRecord, SDocDataTechRecordSchema, SDocDataTechRecordRelation);
        this.dataStore.defineMapper('sdocdatainfo', SDocDataInfoRecord, SDocDataInfoRecordSchema, SDocDataInfoRecordRelation);
        this.dataStore.defineMapper('sdocimage', SDocImageRecord, SDocImageRecordSchema, SDocImageRecordRelation);
        this.dataStore.defineMapper('sdocvideo', SDocVideoRecord, SDocVideoRecordSchema, SDocVideoRecordRelation);
        this.dataStore.defineMapper('sdocratepers', SDocRatePersonalRecord, SDocRatePersonalRecordSchema, SDocRatePersonalRecordRelation);
        this.dataStore.defineMapper('sdocratetech', SDocRateTechRecord, SDocRateTechRecordSchema, SDocRateTechRecordRelation);
    }

    generateNewId(): string {
        return (new Date()).getTime().toString();
    }

    createRecord(props, opts): SDocRecord {
        return <SDocRecord>this.dataStore.createRecord(this.searchMapperName, props, opts);
    }

    add(values: {}, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

        let record: SDocRecord;
        if (! (values instanceof SDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(this.dataStore.getMapper('sdoc'), values);
        } else {
            record = values;
        }

        if (record === undefined || !record.isValid()) {
            return utils.reject('sdo-values not valid');
        }

        return this.dataStore.create('sdoc', record, opts);
    }

    addMany(sdocs: SDocRecord[], opts?: any): Promise<SDocRecord[]> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }
        return this.dataStore.createMany('sdoc', sdocs, opts);
    }

    deleteById(id: string, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }
        return this.dataStore.destroy('sdoc', id, opts);
    }

    updateById(id: string, values: {}, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

        let record: SDocRecord;
        if (! (values instanceof SDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(this.dataStore.getMapper('sdoc'), values);
        } else {
            record = values;
        }

        if (record === undefined || !record.isValid()) {
            return utils.reject('sdoc-values not valid');
        }

        return this.dataStore.update('sdoc', id, record, opts);
    }

    doActionTag(sdocRecord: SDocRecord, actionTagForm: ActionTagForm, opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

        return this.dataStore.doActionTag('sdoc', sdocRecord, actionTagForm, opts);
    }

    doActionTags(sdocRecord: SDocRecord, actionTagForms: ActionTagForm[], opts?: any): Promise<SDocRecord> {
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

        let curSdocRecord = sdocRecord;
        const me = this;
        const promises = actionTagForms.map(actionTagForm => {
            return me.doActionTag(curSdocRecord, actionTagForm, opts)
                .then(function onDone(newSdocRecord: SDocRecord) {
                    curSdocRecord = newSdocRecord;
                    return utils.resolve(newSdocRecord);
                }).catch(function onError(error) {
                    return utils.reject(error);
                });
        });
        const results = Promise.all(promises);

        return results.then(data => {
            return utils.resolve(curSdocRecord);
        }).catch(errors => {
            return utils.reject(errors);
        });
    }

    importRecord(record: SDocRecord, recordIdMapping: {}, recordRecoverIdMapping: {}, opts?: any): Promise<SDocRecord> {
        opts = opts || {};

        const mapper: Mapper = this.getMapper('sdoc');
        const adapter: Adapter = this.getAdapterForMapper('sdoc');
        if (!this.isWritable()) {
            throw new Error('SDocDataService configured: not writable');
        }

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

        const myMappings = {};
        const me = this;
        return adapter.findAll(mapper, query, opts)
            .then(searchResult => {
                if (!searchResult || searchResult.length <= 0) {
                    return utils.resolve(undefined);
                }
                return utils.resolve(searchResult[0]);
            }).then(function recordsDone(sdocRecord: SDocRecord) {
                if (sdocRecord !== undefined) {
                    console.log('EXISTING - record', record.type + ' ' + record.name);
                    const idFieldName = me.typeMapping[record.type.toLowerCase()];
                    myMappings[idFieldName] = record[idFieldName];
                    return utils.resolve(sdocRecord);
                    // console.log('UPDATE - record', record.name);
                    // return dataService.updateById(sdocRecord.id, record);
                }

                // new record: map refIds
                record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
                if (record.type.toLowerCase() === 'location' && record.locIdParent === undefined
                    && record.locId !== me.defaultLocIdParent) {
                    record.locIdParent = me.defaultLocIdParent;
                }
                for (const refIdFieldName of me.idMappings) {
                    if (recordIdMapping[refIdFieldName] && recordIdMapping[refIdFieldName][record[refIdFieldName]]) {
                        console.log('orig: ' + record.id + ' map ref ' + refIdFieldName + ' ' + record[refIdFieldName]
                            + '->' + recordIdMapping[refIdFieldName][record[refIdFieldName]]);
                        record[refIdFieldName] = recordIdMapping[refIdFieldName][record[refIdFieldName]];
                    } else if (record[refIdFieldName] && !(record[refIdFieldName] === null || record[refIdFieldName] === undefined)) {
                        console.log('orig: ' + record.id + ' save ref ' + refIdFieldName + ' ' + record[refIdFieldName]);
                        myMappings[refIdFieldName] = record[refIdFieldName];
                        record[refIdFieldName] = undefined;
                    }
                }

                console.log('ADD - record', record.type + ' ' + record.name);
                return me.add(record).then(function onFullfilled(newSdocRecord: SDocRecord) {
                    sdocRecord = newSdocRecord;
                    return me.doImportActionTags(record, sdocRecord, opts);

                });
            }).then(function recordsDone(newSdocRecord: SDocRecord) {
                const idFieldName = me.typeMapping[record.type.toLowerCase()];

                if (!recordIdMapping.hasOwnProperty(idFieldName)) {
                    recordIdMapping[idFieldName] = {};
                }
                console.log('new: ' + newSdocRecord.id + ' save recordIdMapping ' + idFieldName + ' ' + myMappings[idFieldName]
                    + '->' + newSdocRecord[idFieldName]);
                console.log('new: ' + newSdocRecord.id + ' save recordRecoverIdMapping for ' + ':', myMappings);
                recordIdMapping[idFieldName][myMappings[idFieldName]] = newSdocRecord[idFieldName];
                recordRecoverIdMapping[newSdocRecord.id] = myMappings;

                return utils.resolve(newSdocRecord);
            }).catch(function onError(error) {
                return utils.reject(error);
            });
    }

    postProcessImportRecord(record: SDocRecord, recordIdMapping: {}, recordRecoverIdMapping: {}, opts?: any): Promise<SDocRecord> {
        opts = opts || {};

        if (!recordRecoverIdMapping[record.id]) {
            console.log('new: ' + record.id + ' no ids to recover');
            return utils.resolve(record);
        }

        // recover refIds
        let updateNeeded = false;
        for (const refIdFieldName of this.idMappings) {
            const mappingName = this.idMappingAliases[refIdFieldName] || refIdFieldName;
            const fieldId = recordRecoverIdMapping[record.id][refIdFieldName];
            if (fieldId && recordIdMapping[mappingName] && recordIdMapping[mappingName][fieldId]
                && record[refIdFieldName] !== recordIdMapping[mappingName][fieldId]) {
                console.log('new: ' + record.id + ' recover ref ' + refIdFieldName + ' ' + fieldId
                    + '->' + mappingName + ':' + recordIdMapping[mappingName][fieldId]);
                record[refIdFieldName] = recordIdMapping[mappingName][fieldId];
                updateNeeded = true;
            }
        }
        if (!updateNeeded) {
            console.log('new: ' + record.id + ' no ids to recover');
            return utils.resolve(record);
        }

        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
        return this.updateById(record.id, record, opts).then(function recordsDone(newSdocRecord: SDocRecord) {
            return utils.resolve(newSdocRecord);
        }).catch(function onError(error) {
            return utils.reject(error);
        });
    }

    setWritable(writable: boolean) {
        this.writable = writable;
    }

    isWritable(): boolean {
        return this.writable;
    }

    private doImportActionTags(origSdocRecord: SDocRecord, newSdocRecord: SDocRecord, opts?: {}): Promise<SDocRecord> {
        if (newSdocRecord.type.toLowerCase() !== 'image' && newSdocRecord.type.toLowerCase() !== 'video') {
            return utils.resolve(newSdocRecord);
        }

        // map data of orig-record to new record
        const actionTagForms = [];
        for (let playlist of (origSdocRecord.playlists ? origSdocRecord.playlists.split(',') : [])) {
            playlist = playlist.trim();
            const actionTagForm: ActionTagForm =  {
                type: 'tag',
                recordId: newSdocRecord.id,
                key: 'playlists_' + playlist,
                payload: {
                    playlistkey: playlist,
                    set: true
                }
            };
            actionTagForms.push(actionTagForm);
        }
        for (let person of (origSdocRecord.persons ? origSdocRecord.persons.split(',') : [])) {
            person = person.trim();
            const actionTagForm: ActionTagForm =  {
                type: 'tag',
                recordId: newSdocRecord.id,
                key: 'objects_' + person,
                payload: {
                    objectkey: person,
                    set: true
                }
            };
            actionTagForms.push(actionTagForm);
        }

        if (actionTagForms.length <= 0) {
            return utils.resolve(newSdocRecord);
        }

        console.log('ACTIONTAGS - record', origSdocRecord.type + ' ' + origSdocRecord.name, actionTagForms);
        return this.doActionTags(newSdocRecord, actionTagForms, opts);
    }
}
