import {TourDocRecord, TourDocRecordFactory} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocLinkedPoiRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedpoi-record';
import {FormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/form.utils';
import {TourDocLinkedRouteRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedroute-record';
import {TourDocLinkedInfoRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedinfo-record';
import {TourDocObjectDetectionImageObjectRecord} from '../../../shared/tdoc-commons/model/records/tdocobjectdetectectionimageobject-record';
import {TourDocImageRecord} from '../../../shared/tdoc-commons/model/records/tdocimage-record';
import {ObjectDetectionDetectedObjectType} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';

export class TourDocJoinUtils {

    public static prepareLinkedPoiSubmitValues(record: TourDocRecord, values: {}, joinName: string, joinIndexes: any[]): {}[] {
        const joins: {}[] = [];
        for (const idx of joinIndexes) {
            const refId = FormUtils.getStringFormValue(values, joinName + 'Id' + idx);
            const position = FormUtils.getNumberFormValue(values, joinName + 'Position' + idx);
            const poitype = FormUtils.getNumberFormValue(values, joinName + 'Poitype' + idx);
            if (refId !== undefined && refId !== 'undefined') {
                joins.push({
                    tdoc_id: record.id,
                    name: 'dummy',
                    refId: refId,
                    position: position,
                    poitype: poitype,
                    type: 'dummy'
                })
            }
        }

        return joins;
    }

    public static prepareLinkedRoutesSubmitValues(record: TourDocRecord, values: {}, joinName: string, joinIndexes: any[]):  {}[] {
        const joins: {}[] = [];

        for (let idx = 1; idx <= joinIndexes.length; idx ++) {
            const refId = FormUtils.getStringFormValue(values, joinName + 'Id' + idx);
            const full = FormUtils.getStringFormValue(values, joinName + 'Full' + idx);
            const linkedRouteAttr = FormUtils.getStringFormValue(values, joinName + 'LinkedRouteAttr' + idx);
            if (refId !== undefined && refId !== 'undefined') {
                joins.push({
                    tdoc_id: record.id,
                    name: 'dummy',
                    refId: refId,
                    full: full ? true : false,
                    linkedRouteAttr: linkedRouteAttr,
                    type: 'subRoute'
                })
            }
        }

        return joins;
    }

    public static prepareLinkedInfosSubmitValues(record: TourDocRecord, values: {}, joinName: string, joinIndexes: any[]): {}[] {
        const joins: {}[] = [];

        for (let idx = 1; idx <= joinIndexes.length; idx ++) {
            const refId = FormUtils.getStringFormValue(values, joinName + 'Id' + idx);
            const linkedDetails = FormUtils.getStringFormValue(values, joinName + 'LinkedDetails' + idx);
            if (refId !== undefined && refId !== 'undefined') {
                joins.push({
                    tdoc_id: record.id,
                    name: 'dummy',
                    refId: refId,
                    linkedDetails: linkedDetails,
                    type: 'dummy'
                })
            }
        }

        return joins;
    }

    public static prepareLinkedObjectDetectionSubmitValues(record: TourDocRecord, values: {}, joinName: string, joinIndexes: any[]): {}[] {
        const images: TourDocImageRecord[] = record.get('tdocimages') || [];
        const imageFileName = images.length > 0
            ? images[0].fileName
            : 'dummyfile.jpg';

        const joins: {}[] = [];
        for (const idx of joinIndexes) {
            joins.push({
                tdoc_id: record.id,
                ioId: record.id,
                name: imageFileName,
                fileName: imageFileName,
                category: FormUtils.getStringFormValue(values, joinName + 'category' + idx),
                detector: FormUtils.getStringFormValue(values, joinName + 'detector' + idx),
                imgHeight: FormUtils.getNumberFormValue(values, joinName + 'imgHeight' + idx),
                imgWidth: FormUtils.getNumberFormValue(values, joinName + 'imgWidth' + idx),
                key: FormUtils.getStringFormValue(values, joinName + 'key' + idx),
                objHeight: FormUtils.getNumberFormValue(values, joinName + 'objHeight' + idx),
                objWidth: FormUtils.getNumberFormValue(values, joinName + 'objWidth' + idx),
                objX: FormUtils.getNumberFormValue(values, joinName + 'objX' + idx),
                objY: FormUtils.getNumberFormValue(values, joinName + 'objY' + idx),
                precision: FormUtils.getNumberFormValue(values, joinName + 'precision' + idx),
                state: FormUtils.getStringFormValue(values, joinName + 'state' + idx),
            })
        }

        return joins;
    }

    public static appendLinkedRoutesToDefaultFormValueConfig(record: TourDocRecord, valueConfig: {}, joinName: string): any[] {
        const joinRecords: TourDocLinkedRouteRecord[] = record.get('tdoclinkedroutes') || [];

        const indexes = [];
        let idx = 1;
        for (; idx <= joinRecords.length; idx ++) {
            const joinRecord = joinRecords[idx - 1];
            if (joinRecord.type === 'mainroute') {
                valueConfig['linkedRouteAttr'] =
                    [
                        joinRecord.linkedRouteAttr && joinRecord.linkedRouteAttr !== 'null'
                            ? joinRecord.linkedRouteAttr
                            : ''
                    ];
                continue;
            }

            if (joinRecord.type !== 'subroute') {
                continue;
            }

            indexes.push(idx);
            valueConfig[joinName + 'Id' + idx] = [joinRecord.refId];
            valueConfig[joinName + 'Full' + idx] = [joinRecord.full];
            valueConfig[joinName + 'LinkedRouteAttr' + idx] =
                [
                    joinRecord.linkedRouteAttr && joinRecord.linkedRouteAttr !== 'null'
                        ? joinRecord.linkedRouteAttr
                        : ''
                ];
        }

        indexes.push(idx);
        valueConfig[joinName + 'Id' + idx] = [];
        valueConfig[joinName + 'Full' + idx] = [];
        valueConfig[joinName + 'LinkedRouteAttr' + idx] = [];

        return indexes;
    }

    public static appendLinkedInfosToDefaultFormValueConfig(record: TourDocRecord, valueConfig: {}, joinName: string): any[] {
        const joinRecords: TourDocLinkedInfoRecord[] = record.get('tdoclinkedinfos') || [];

        const indexes = [];
        let idx = 1;
        for (; idx <= joinRecords.length; idx ++) {
            const joinRecord = joinRecords[idx - 1];
            indexes.push(idx);
            valueConfig[joinName + 'Id' + idx] = [joinRecord.refId];
            valueConfig[joinName + 'LinkedDetails' + idx] = [joinRecord.linkedDetails];
        }

        indexes.push(idx);
        valueConfig[joinName + 'Id' + idx] = [];
        valueConfig[joinName + 'LinkedDetails' + idx] = [];

        return indexes;
    }

    public static appendLinkedPoisToDefaultFormValueConfig(record: TourDocRecord, valueConfig: {}, joinName: string): any[] {
        const joinRecords: TourDocLinkedPoiRecord[] = record.get('tdoclinkedpois') || [];

        const indexes = [];
        let idx = 1;
        for (; idx <= joinRecords.length; idx ++) {
            const joinRecord = joinRecords[idx - 1];
            indexes.push(idx);
            valueConfig[joinName + 'Id' + idx] = [joinRecord.refId];
            valueConfig[joinName + 'Name' + idx] = [joinRecord.name];
            valueConfig[joinName + 'Position' + idx] = [joinRecord.position];
            valueConfig[joinName + 'Poitype' + idx] = [joinRecord.poitype + ''];
            valueConfig[joinName + 'GeoLoc' + idx] = [joinRecord.geoLoc];
            valueConfig[joinName + 'GeoEle' + idx] = [joinRecord.geoEle];
        }

        return indexes;
    }

    public static appendLinkedObjectDetectionsToDefaultFormValueConfig(record: TourDocRecord, valueConfig: {}, joinName: string): any[] {
        const joinRecords: TourDocObjectDetectionImageObjectRecord[] = record.get('tdocodimageobjects') || [];

        const indexes = [];
        const idx = '';
        indexes.push(idx);
        const joinRecord = joinRecords.length > 0
            ? joinRecords[0]
            : undefined;

        TourDocJoinUtils.appendLinkedObjectDetectionToDefaultFormValueConfig(joinRecord, valueConfig, joinName, idx);

        return indexes;
    }

    public static appendLinkedObjectDetectionToDefaultFormValueConfig(joinRecord: ObjectDetectionDetectedObjectType,
                                                                      valueConfig: {}, joinName: string, idx: string): void {
        valueConfig[joinName + 'category' + idx] = joinRecord ? [joinRecord['category']] : [];
        valueConfig[joinName + 'detector' + idx] = joinRecord ? [joinRecord.detector] : [];
        valueConfig[joinName + 'imgHeight' + idx] = joinRecord ? [joinRecord.imgHeight] : [];
        valueConfig[joinName + 'imgWidth' + idx] = joinRecord ? [joinRecord.imgWidth] : [];
        valueConfig[joinName + 'key' + idx] = joinRecord ? [joinRecord.key] : [];
        valueConfig[joinName + 'objHeight' + idx] = joinRecord ? [joinRecord.objHeight] : [];
        valueConfig[joinName + 'objWidth' + idx] = joinRecord ? [joinRecord.objWidth] : [];
        valueConfig[joinName + 'objX' + idx] = joinRecord ? [joinRecord.objX] : [];
        valueConfig[joinName + 'objY' + idx] = joinRecord ? [joinRecord.objY] : [];
        valueConfig[joinName + 'precision' + idx] = joinRecord ? [joinRecord.precision] : [];
        valueConfig[joinName + 'state' + idx] = joinRecord ? [joinRecord.state] : [];
    }

    public static preparePoiMapValuesFromForm(values: {}, joinIndexes: {[key: string]: any[]}): TourDocRecord[] {
        const poiGeoRecords: TourDocRecord[] = [];
        const joinName = 'linkedPois';

        const poiJoinIndexes = joinIndexes[joinName];
        for (const idx of poiJoinIndexes) {
            const refId = FormUtils.getStringFormValue(values, joinName + 'Id' + idx);
            const name = FormUtils.getStringFormValue(values, joinName + 'Name' + idx);
            const geoLoc = FormUtils.getStringFormValue(values, joinName + 'GeoLoc' + idx);
            const lst = geoLoc ? geoLoc.split(',') : [];
            if (refId !== undefined && refId !== 'undefined') {
                poiGeoRecords.push(TourDocRecordFactory.createSanitized({
                    id: 'TMPLOC' + (new Date()).getTime(),
                    geoLoc: geoLoc,
                    geoLat: lst.length > 1 ? lst[0] : undefined,
                    geoLon: lst.length > 1 ? lst[1] : undefined,
                    name: name,
                    type: 'POI',
                    datestart: new Date().toISOString(),
                    dateend: new Date().toISOString()
                }));
            }
        }

        return poiGeoRecords;
    }

    public static preparePoiMapValuesFromRecord(record: TourDocRecord):  TourDocRecord[] {
        const poiGeoRecords: TourDocRecord[] = [];
        const likedPOis: TourDocLinkedPoiRecord[] = record && record['tdoclinkedpois']
            ? <TourDocLinkedPoiRecord[]>record['tdoclinkedpois']
            : [];

        for (const linkedPoi of likedPOis) {
            const refId = linkedPoi.refId;
            const name = linkedPoi.name;
            const geoLoc = linkedPoi.geoLoc;
            const lst = geoLoc ? geoLoc.split(',') : [];
            if (refId !== undefined && refId !== 'undefined') {
                poiGeoRecords.push(TourDocRecordFactory.createSanitized({
                    id: 'TMPLOC' + (new Date()).getTime(),
                    geoLoc: geoLoc,
                    geoLat: lst.length > 1 ? lst[0] : undefined,
                    geoLon: lst.length > 1 ? lst[1] : undefined,
                    name: name,
                    type: 'POI',
                    datestart: new Date().toISOString(),
                    dateend: new Date().toISOString()
                }));
            }
        }

        return poiGeoRecords;
    }

}
