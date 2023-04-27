import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {CommonDocRecordCreateResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-create.resolver';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ResolvedData} from '@dps/mycms-frontend-commons/dist/angular-commons/resolver/resolver.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Injectable()
export class PDocRecordCreateResolver extends CommonDocRecordCreateResolver<PDocRecord, PDocSearchForm,
    PDocSearchResult, PDocDataService> {
    private myAppService: GenericAppService;
    constructor(appService: GenericAppService, dataService: PDocDataService) {
        super(appService, dataService);
        this.myAppService = appService;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<PDocRecord>> {
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
                fields.push('gpsTrackSrc', 'gpsTrackState', 'locId', 'subtype');
                fields.push('pdocratepers.gesamt',
                    'pdocratepers.ausdauer',
                    'pdocratepers.bildung',
                    'pdocratepers.kraft',
                    'pdocratepers.mental',
                    'pdocratepers.motive',
                    'pdocratepers.schwierigkeit',
                    'pdocratepers.wichtigkeit',
                    'pdocratetech.overall',
                    'pdocratetech.klettern',
                    'pdocratetech.ks',
                    'pdocratetech.bergtour',
                    'pdocratetech.firn',
                    'pdocratetech.gletscher',
                    'pdocratetech.schneeschuh',
                    'pdocdatatech.altAsc',
                    'pdocdatatech.altDesc',
                    'pdocdatatech.altMin',
                    'pdocdatatech.altMax',
                    'pdocdatatech.dist',
                    'pdocdatatech.dur',
                    'pdocdatainfo.baseloc',
                    'pdocdatainfo.destloc',
                    'pdocdatainfo.region',
                    'pdocdatainfo.sectionDetails',
                    'pdoclinkedinfos'
                    );
                break;
            case 'trip':
                fields.push('datestart', 'dateend', 'locId');
                break;
            case 'poi':
                fields.push('locId');

                // remove desc... it will not be used here...
                for (const field of ['keywords', 'desc', 'descTxt', 'descMd']) {
                    const index = fields.indexOf(field);
                    if (index > -1) {
                        fields.splice(index, 1);
                    }
                }
                break;
            case 'news':
                fields.push('datestart', 'dateend');
                break;
            case 'info':
                fields.push(
                    'locId', 'subtype',
                    'pdocinfo.shortDesc', 'pdocinfo.reference', 'pdocinfo.publisher');
                break;
            case 'image':
            case 'video':
                fields.push('datestart', 'locId');
                fields.push('pdocratepers.gesamt',
                    'pdocratepers.motive',
                    'pdocratepers.wichtigkeit');
                break;
            case 'location':
                fields.push('gpsTrackSrc', 'gpsTrackState', 'geoLon', 'geoLat', 'geoLoc', 'subtype');
                fields.push('locIdParent');
                break;
            case 'odimgobject':
                fields.push('datestart', 'imageId', 'pdocimages');
                break;
        }
    }

    protected copyDefaultFields(type: string, pdoc: PDocRecord, values: {}): void {
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
        return this.getCommonReplacements('components.pdoc-create-resolver.nameReplacements');
    }

    protected getLocationReplacements(): [RegExp, string][] {
        return this.getCommonReplacements('components.pdoc-create-resolver.locationReplacements');
    }

    protected getCommonReplacements(configKey: string): [RegExp, string][] {
        const config = this.myAppService.getAppConfig();
        const value = BeanUtils.getValue(config, configKey);

        return StringUtils.createReplacementsFromConfigArray(value);
    }
}
