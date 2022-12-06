import {ItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {Mapper} from 'js-data';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {isNumeric} from 'rxjs/internal-compatibility';
import {ObjectUtils} from '@dps/mycms-commons/dist/commons/utils/object.utils';
import {BaseEntityRecordRelationsType} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export interface RefMappingType {
    [id: string]:  {
        [filterField: string]: any[]
    };
}


export interface RefConfigType {
    containerField: string,
    refField: string,
    idPrefix: string,
    filterFields: string[]
}

export interface ExtendedItemsJsConfig extends ItemsJsConfig {
    aggregationFields: string[],
    refConfigs: RefConfigType[],
    skipMediaCheck: boolean
}

export class ItemsJsDataImporter {

    protected _objectSeparator = ';;';
    protected _fieldSeparator = ':::';
    protected _valueSeparator = '=';
    protected itemsJsConfig: ExtendedItemsJsConfig;

    public static prepareConfiguration(itemsJsConfig: ExtendedItemsJsConfig) {
        for (const aggreationName in itemsJsConfig.aggregations) {
            const aggregation = itemsJsConfig.aggregations[aggreationName];
            if (!aggregation['field']) {
                aggregation['field'] = aggreationName;
            }
        }

        for (const fieldName of itemsJsConfig.aggregationFields) {
            if (fieldName.endsWith('_i') || fieldName.endsWith('_s')) {
                if (!itemsJsConfig.aggregations[fieldName]) {
                    itemsJsConfig.aggregations[fieldName] = {
                        conjunction: false,
                        sort: 'term',
                        order: 'asc',
                        hide_zero_doc_count: true,
                        size: 9999
                    };
                }

                if (!itemsJsConfig.aggregations[fieldName + 's']) {
                    itemsJsConfig.aggregations[fieldName + 's'] = {
                        conjunction: false,
                        sort: 'term',
                        order: 'asc',
                        hide_zero_doc_count: true,
                        size: 9999
                    };
                }
            }
        }
    }

    constructor(itemsJsConfig: ExtendedItemsJsConfig) {
        this.itemsJsConfig = itemsJsConfig;
    }

    public mapToItemJsDocuments(data: any) {
        const recordIds = {};
        const records = [];
        const recordMap = {};
        const imagePathes = {};
        const videoPathes = {};
        // check for duplicates and fill media-container
        for (const record of data) {
            if (!record['id'] || record['id'] === '') {
                console.warn('SKIPPED record - no id', record['id'], record);
                continue;
            }

            if (recordIds[record['id']]) {
                console.warn('SKIPPED record - id already exists id/existing/skipped', record['id'], recordIds[record['id']], record);
                continue;
            }

            records.push(record);
            recordIds[record['id']] = records.length - 1;

            delete record['gpstracks_basefile_s'];

            let mediaUrl: string = record['i_fav_url_txt'];
            if (mediaUrl && record['type_s'] === 'IMAGE') {
                imagePathes[mediaUrl] = mediaUrl;
            }

            mediaUrl = record['v_fav_url_txt'];
            if (mediaUrl && record['type_s'] === 'VIDEO') {
                videoPathes[mediaUrl] = mediaUrl;
            }

            recordMap[record.id] = record;
        }

        const refMappings = this.generateRelationMappings(recordMap);
        this.remapRelationMappings(recordMap, refMappings);

        if (!this.itemsJsConfig.skipMediaCheck) {
            this.clearNotExistingMediaPathes(records, imagePathes, videoPathes);
        }

        return records;
    }


    public createRecordFromJson(responseMapper: GenericAdapterResponseMapper, mapper: Mapper, props: any,
                                relationType: BaseEntityRecordRelationsType): any {
        for (const key in relationType.hasOne) {
            if (props[key]) {
                for (const fieldName in props[key]) {
                    props[key + '.' + fieldName] = props[key][fieldName];
                }
            }
        }

        for (const key in relationType.hasMany) {
            if (props[key]) {
            }
        }

        return responseMapper.mapValuesToRecord(mapper, props);
    }

    public extendAdapterDocument(values: {}) {
        // remap fields with fallbacks
        values['actiontype_s'] = values['actiontype_s'] || values['subtype_s'];
        values['dateshow_dt'] = values['dateshow_dt'] || values['datestart_dt']
        values['html'] = values['name_s'] + ' ' +  values['desc_txt'];

        // prepare aggregations
        for (const filterBase of ['keywords', 'objects', 'persons', 'playlists']) {
            values[filterBase + '_ss'] = values[filterBase + '_txt'];
        }

        for (const aggreationName in this.itemsJsConfig.aggregations) {
            const aggregation = this.itemsJsConfig.aggregations[aggreationName];
            if (aggregation.filterFunction) {
                values[aggreationName] = aggregation.filterFunction.call(this, values);
            } else if (aggregation['mapField']) {
                values[aggreationName] = values[aggregation['mapField']];
            }
        }

        // override some aggregations
        values['type_txt'] = values['type_txt']
            ? values['type_txt']
            : values['type_s'];
        values['type_txt'] = values['type_txt']
            ? values['type_txt'].toLowerCase()
            : '';

        values['year_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getFullYear()
            : undefined;
        values['month_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getMonth() + 1
            : undefined;
        values['done_ss'] = values['dateshow_dt']
            ? 'DONE1'
            : 'DONE0';

        if (values['loc_lochirarchie_s']) {
            values['loc_lochirarchie_txt'] = values['loc_lochirarchie_s'].split(',,');
        }

        // add aggregations for searchableFields if not exists
        for (const fieldName of this.itemsJsConfig.searchableFields) {
            if ((fieldName.endsWith('_i') || fieldName.endsWith('_s')) && !values[fieldName + 's']) {
                values[fieldName + 's'] = values[fieldName];
            }
        }

        // remap to String because itemjs is string-search-engine ;-)
        for (const fieldName of [].concat(this.itemsJsConfig.aggregationFields).concat()) {
            if (isNumeric(values[fieldName])) {
                values[fieldName] = values[fieldName] + '';
            }
        }

        for (const key in values) {
            if ((key.endsWith('_ss') || key.endsWith('_is') || key.endsWith('_fs')) && isNumeric(values[key])) {
                values[key] = values[key] + '';
            }
        }

        return values;
    }

    protected lazyCheckForFilePath(pathes: {}, needle: string): string {
        const normalizedTries = [];
        if (!needle) {
            return undefined;
        }

        normalizedTries.push(needle);
        if (pathes[needle]) {
            return needle;
        }

        let normalized = needle.replace(/^\//, '');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        normalized = needle.replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        normalized = '/' + needle;
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        normalized = '/' + needle.replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        if (needle.length === 1) {
            // console.debug('no matching path found - checked normalized pathes', normalizedTries);
            return undefined;
        }

        normalized = needle.substr(0, 1)
            + needle.substr(1, needle.length).replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }

        // console.debug('no matching path found - checked normalized pathes', normalizedTries);

        return undefined;
    }

    protected clearNotExistingMediaPathes(records: any[], imagePathes: {}, videoPathes: {}) {
        // delete reference if media-path not exists in media-container
        for (const record of records) {
            let mediaUrl: string = record['i_fav_url_txt'];
            if (mediaUrl && record['type_s'] !== 'IMAGE' && !imagePathes[mediaUrl]) {
                const normalizedUrl = this.lazyCheckForFilePath(imagePathes, mediaUrl);
                if (normalizedUrl && imagePathes[normalizedUrl]) {
                    // console.debug('FavImage REMAPPED i_fav_url_txt remapped:', mediaUrl, normalizedUrl);
                    record['i_fav_url_txt'] = normalizedUrl;
                } else {
                    // console.debug('FavImage NOT FOUND i_fav_url_txt:', mediaUrl);
                    delete record['i_fav_url_txt'];
                }
            }

            mediaUrl = record['v_fav_url_txt'];
            if (mediaUrl && record['type_s'] !== 'VIDEO' && !imagePathes[mediaUrl]) {
                const normalizedUrl = this.lazyCheckForFilePath(videoPathes, mediaUrl);
                if (normalizedUrl && videoPathes[normalizedUrl]) {
                    // console.debug('FavVideo REMAPPED v_fav_url_txt remapped:', mediaUrl, normalizedUrl);
                    record['v_fav_url_txt'] = normalizedUrl;
                } else {
                    // console.debug('FavVideo RESET v_fav_url_txt:', mediaUrl);
                    delete record['v_fav_url_txt'];
                }
            }
        }
    }

    protected generateRelationMappings(recordMap: {}): RefMappingType {
        const result: RefMappingType = {};

        for (const recordId of Object.keys(recordMap)) {
            const record = recordMap[recordId];
            for (const refConfig of this.itemsJsConfig.refConfigs) {
                const container = record[refConfig.containerField];
                if (container) {
                    const refIds = [];
                    const objects = ObjectUtils.explodeValueToObjects(container, this._objectSeparator,
                        this._fieldSeparator, this._valueSeparator, true);
                    for (const object of objects) {
                        const refId = object[refConfig.refField];
                        if (refId) {
                            refIds.push(refId);
                        }
                    }

                    for (const filterField of refConfig.filterFields) {
                        if (!record[filterField]) {
                            record[filterField] = [];
                        }

                        if (!Array.isArray(record[filterField])) {
                            record[filterField] = [record[filterField]];
                        }

                        record[filterField] = record[filterField].concat(refIds);

                        for (const refId of refIds) {
                            const fullRefId = refConfig.idPrefix + refId;
                            if (!result[fullRefId]) {
                                result[fullRefId] = {};
                            }

                            if (!result[fullRefId][filterField]) {
                                result[fullRefId][filterField] = [];
                            }

                            result[fullRefId][filterField].push(recordId);
                        }
                    }
                }
            }
        }

        return result;
    }

    protected remapRelationMappings(recordMap: {}, refMappings: RefMappingType) {
        // TODO map to original-record instead opf reference
        for (const recordId of Object.keys(recordMap)) {
            const record = recordMap[recordId];
            const recordRefMappings = refMappings[record['id']];
            if (!recordRefMappings) {
                continue;
            }

        }
    }

    protected getItemsJsConfig(): ItemsJsConfig {
        return this.itemsJsConfig;
    }

}

