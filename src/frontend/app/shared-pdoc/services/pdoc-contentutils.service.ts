import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PDocRecord} from '@dps/mycms-commons/dist//pdoc-commons/model/records/pdoc-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {
    CommonDocContentUtils,
    CommonDocContentUtilsConfig,
    CommonItemData
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';

export interface PDocItemData extends CommonItemData {
}

@Injectable()
export class PDocContentUtils extends CommonDocContentUtils {
    constructor(sanitizer: DomSanitizer, cdocRoutingService: CommonDocRoutingService, appService: GenericAppService) {
        super(sanitizer, cdocRoutingService, appService);
    }

    getStyleClassForRecord(record: PDocRecord, layout: string): string[] {
        const value = record['pdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getPDocSubItemFiltersForType(record: PDocRecord, type: string, theme: string, minPerPage?: number): any {
        const filters = {
            type: type
        };

        filters['sort'] = 'ratePers';

        if (type === 'ALL_ENTRIES') {
            filters['type'] = 'PAGE';
        }

        if (record.type === 'PAGE') {
           if (type === 'PAGE') {
                filters['moreFilter'] = 'page_id_i:' + record.pageId;
            } else {
               filters['moreFilter'] = 'page_id_i:' + record.pageId;
            }
        }

        if (minPerPage && minPerPage > 0 && minPerPage > filters['perPage']) {
            filters['perPage'] = minPerPage;
        }

        return filters;
    }

    updateItemData(itemData: PDocItemData, record: PDocRecord, layout: string): boolean {
        super.updateItemData(itemData, record, layout);
        if (record === undefined) {
            return false;
        }

        itemData.styleClassFor = this.getStyleClassForRecord(<PDocRecord>itemData.currentRecord, layout);
    }

    protected getServiceConfig(): CommonDocContentUtilsConfig {
        return {
            cdocRecordRefIdField: undefined,
            cdocAudiosKey: undefined,
            cdocImagesKey: undefined,
            cdocVideosKey: undefined
        };
    }
}
