import {Injectable} from '@angular/core';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {AbstractCommonDocRecordCreateResolver} from '../../../shared/frontend-cdoc-commons/resolver/abstract-cdoc-create.resolver';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';

@Injectable()
export class SDocRecordCreateResolver extends AbstractCommonDocRecordCreateResolver<SDocRecord, SDocSearchForm,
    SDocSearchResult, SDocDataService> {
    constructor(appService: GenericAppService, dataService: SDocDataService) {
        super(appService, dataService);
    }

    protected configureDefaultFieldToSet(type: string, fields: string[]): void {
        switch (type.toLowerCase()) {
            case 'track':
            case 'route':
                fields.push('gpsTrackSrc', 'locId', 'subtype');
                fields.push('sdocratepers.gesamt',
                    'sdocratepers.ausdauer',
                    'sdocratepers.bildung',
                    'sdocratepers.kraft',
                    'sdocratepers.mental',
                    'sdocratepers.motive',
                    'sdocratepers.schwierigkeit',
                    'sdocratepers.wichtigkeit',
                    'sdocdatatech.altAsc',
                    'sdocdatatech.altDesc',
                    'sdocdatatech.altMin',
                    'sdocdatatech.altMax',
                    'sdocdatatech.dist',
                    'sdocdatatech.dur');
                break;
            case 'image':
                fields.push('datestart', 'locId');
                fields.push('sdocratepers.gesamt',
                    'sdocratepers.motive',
                    'sdocratepers.wichtigkeit');
                break;
            case 'video':
                fields.push('datestart', 'locId');
                fields.push('sdocratepers.gesamt',
                    'sdocratepers.motive',
                    'sdocratepers.wichtigkeit');
                break;
            case 'location':
                fields.push('locIdParent');
                break;
        }
    }

    protected copyDefaultFields(type: string, sdoc: SDocRecord, values: {}): void {
        if (type.toLowerCase() === 'route') {
            values['sdocdatainfo.baseloc'] = sdoc.locHirarchie;
            values['sdocdatainfo.destloc'] = sdoc.locHirarchie;
            values['sdocdatainfo.region'] = sdoc.locHirarchie;
        }
    }

    protected setDefaultFields(type: string, values: {}): void {
        if (type.toLowerCase() === 'location') {
            values['locIdParent'] = 1;
        }
    }
}
