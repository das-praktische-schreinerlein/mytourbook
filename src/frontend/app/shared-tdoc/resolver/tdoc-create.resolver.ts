import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocRecordCreateResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-create.resolver';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ResolvedData} from '@dps/mycms-frontend-commons/dist/angular-commons/resolver/resolver.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Injectable()
export class TourDocRecordCreateResolver extends CommonDocRecordCreateResolver<TourDocRecord, TourDocSearchForm,
    TourDocSearchResult, TourDocDataService> {
    private myAppService: GenericAppService;
    constructor(appService: GenericAppService, dataService: TourDocDataService) {
        super(appService, dataService);
        this.myAppService = appService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<TourDocRecord>> {
        const res = super.resolve(route, state);
            res.then(value => {
                if (value.data !== undefined) {
                    const name = value.data.name;
                    if (name !== undefined && name !== null ) {
                        value.data.name = StringUtils.doReplacements(name, this.getNameReplacements());
                    }
                }

                return value;
            });

        return res;
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
            values['trackId'] = tdoc.trackId;
            let locHirarchie = tdoc.locHirarchie !== undefined && tdoc.locHirarchie !== null ? tdoc.locHirarchie : '';
            locHirarchie = locHirarchie.replace(/^OFFEN -> /, '');
            locHirarchie = StringUtils.doReplacements(locHirarchie, this.getLocationReplacements())

            const locs = locHirarchie.split(/ -> /);
            if (locs.length > 3) {
                locs.splice(2, locs.length - 3);
            }
            values['tdocdatainfo.baseloc'] = locs.join(' - ');
            values['tdocdatainfo.destloc'] = locs.pop();

            const regions = locHirarchie.split(/ -> /);
            if (regions.length > 1) {
                regions.splice(regions.length - 1, 1);
                if (regions.length > 2) {
                    regions.splice(1, regions.length - 2);
                }
            }
            values['tdocdatainfo.region'] = regions.join(' - ');
        }

        switch (type.toLowerCase()) {
            case 'info':
            case 'location':
            case 'track':
            case 'route':
                if (values['keywords'] === undefined || values['keywords'] === null || values['keywords'] === '') {
                    values['keywords'] = 'KW_TODOKEYWORDS';
                }
        }

        switch (type.toLowerCase()) {
            case 'info':
            case 'news':
            case 'trip':
            case 'location':
            case 'track':
            case 'route':
                if (values['descTxt'] === undefined || values['descTxt'] === null || values['descTxt'] === '') {
                    values['descTxt'] = 'TODODESC';
                }
        }
    }

    protected setDefaultFields(type: string, values: {}): void {
        if (type.toLowerCase() === 'location') {
            values['locIdParent'] = 1;
        }
    }

    protected getNameReplacements(): [RegExp, string][] {
        return this.getCommonReplacements('components.tdoc-create-resolver.nameReplacements');
    }

    protected getLocationReplacements(): [RegExp, string][] {
        return this.getCommonReplacements('components.tdoc-create-resolver.locationReplacements');
    }

    protected getCommonReplacements(configKey: string): [RegExp, string][] {
        const config = this.myAppService.getAppConfig();
        const value = BeanUtils.getValue(config, configKey);

        return StringUtils.createReplacementsFromConfigArray(value);
    }
}
