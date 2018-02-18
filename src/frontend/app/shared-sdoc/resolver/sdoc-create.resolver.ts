import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';
import {LogUtils} from '../../../shared/commons/utils/log.utils';
import {SDocRecordResolver} from './sdoc-details.resolver';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {BeanUtils} from '../../../shared/commons/utils/bean.utils';

@Injectable()
export class SDocRecordCreateResolver implements Resolve<ResolvedData<SDocRecord>> {
    static ERROR_UNKNOWN_SDOC_TYPE = 'ERROR_UNKNOWN_SDOC_TYPE';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private dataService: SDocDataService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<SDocRecord>> {
        const result: ResolvedData<SDocRecord> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<SDocRecord>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    const type = route.params['createByType'];
                    if (!this.idValidationRule.isValid(type)) {
                        console.warn('warning no valid type for sdoc:', LogUtils.sanitizeLogMsg(type));
                        result.error = new ResolverError(SDocRecordCreateResolver.ERROR_UNKNOWN_SDOC_TYPE, type, undefined);
                        return resolve(result);
                    }

                    const values = { type: type.toUpperCase(), keywords: ''};

                    const baseId = route.params['createBaseId'];
                    if (baseId && this.idValidationRule.isValid(baseId)) {
                        this.dataService.getById(baseId).then(
                            function doneGetById(sdoc: SDocRecord) {
                                if (sdoc === undefined) {
                                    console.log('no sdoc for id:' + LogUtils.sanitizeLogMsg(baseId));
                                    result.error = new ResolverError(SDocRecordResolver.ERROR_UNKNOWN_SDOC_ID, baseId, undefined);
                                    return resolve(result);
                                }

                                const fields = ['name', 'keywords', 'descTxt', 'descMd'];
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
                                    case 'location':
                                        fields.push('locIdParent');
                                        break;
                                }

                                if (type.toLowerCase() === 'route') {
                                    values['sdocdatainfo.baseloc'] = sdoc.locHirarchie;
                                    values['sdocdatainfo.destloc'] = sdoc.locHirarchie;
                                    values['sdocdatainfo.region'] = sdoc.locHirarchie;
                                }

                                for (const field of fields) {
                                    values[field] = BeanUtils.getValue(sdoc, field);
                                }

                                result.data = new SDocRecord(values);

                                return resolve(result);
                            }).catch(function errorGetById(reason: any) {
                                console.error('error sdoc for id:' + LogUtils.sanitizeLogMsg(baseId), reason);
                                result.error = new ResolverError(SDocRecordResolver.ERROR_READING_SDOC_ID, baseId, reason);
                                return resolve(result);
                            }
                        );
                    } else {
                        if (type.toLowerCase() === 'location') {
                            values['locIdParent'] = 1;
                        }

                        result.data = new SDocRecord(values);
                        return resolve(result);
                    }

                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }
}
