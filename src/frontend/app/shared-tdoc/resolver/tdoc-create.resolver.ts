import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocRecordCreateResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-create.resolver';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';

@Injectable()
export class TourDocRecordCreateResolver extends CommonDocRecordCreateResolver<TourDocRecord, TourDocSearchForm,
    TourDocSearchResult, TourDocDataService> {
    constructor(appService: GenericAppService, dataService: TourDocDataService) {
        super(appService, dataService);
    }

    protected configureDefaultFieldToSet(type: string, fields: string[]): void {
        switch (type.toLowerCase()) {
            case 'track':
            case 'route':
                fields.push('gpsTrackSrc', 'locId', 'subtype');
                fields.push('tdocratepers.gesamt',
                    'tdocratepers.ausdauer',
                    'tdocratepers.bildung',
                    'tdocratepers.kraft',
                    'tdocratepers.mental',
                    'tdocratepers.motive',
                    'tdocratepers.schwierigkeit',
                    'tdocratepers.wichtigkeit',
                    'tdocdatatech.altAsc',
                    'tdocdatatech.altDesc',
                    'tdocdatatech.altMin',
                    'tdocdatatech.altMax',
                    'tdocdatatech.dist',
                    'tdocdatatech.dur');
                break;
            case 'trip':
                fields.push('datestart', 'locId', 'dateend');
                break;
            case 'news':
                fields.push('datestart', 'dateend');
                break;
            case 'image':
                fields.push('datestart', 'locId');
                fields.push('tdocratepers.gesamt',
                    'tdocratepers.motive',
                    'tdocratepers.wichtigkeit');
                break;
            case 'video':
                fields.push('datestart', 'locId');
                fields.push('tdocratepers.gesamt',
                    'tdocratepers.motive',
                    'tdocratepers.wichtigkeit');
                break;
            case 'location':
                fields.push('locIdParent');
                break;
        }
    }

    protected copyDefaultFields(type: string, tdoc: TourDocRecord, values: {}): void {
        if (type.toLowerCase() === 'route') {
            values['tdocdatainfo.baseloc'] = tdoc.locHirarchie;
            values['tdocdatainfo.destloc'] = tdoc.locHirarchie;
            values['tdocdatainfo.region'] = tdoc.locHirarchie;
        }
    }

    protected setDefaultFields(type: string, values: {}): void {
        if (type.toLowerCase() === 'location') {
            values['locIdParent'] = 1;
        }
    }
}
