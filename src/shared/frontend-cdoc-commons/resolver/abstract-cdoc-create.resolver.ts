import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../commons/services/generic-app.service';
import {IdValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../angular-commons/resolver/resolver.utils';
import {LogUtils} from '../../commons/utils/log.utils';
import {BeanUtils} from '../../commons/utils/bean.utils';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {AbstractCommonDocRecordResolver} from './abstract-cdoc-details.resolver';

export abstract class AbstractCommonDocRecordCreateResolver<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>>
    implements Resolve<ResolvedData<R>> {
    static ERROR_UNKNOWN_DOC_TYPE = 'ERROR_UNKNOWN_DOC_TYPE';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private dataService: D) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<R>> {
        const result: ResolvedData<R> = {
            route: route,
            state: state
        };

        const me = this;
        return new Promise<ResolvedData<R>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    const type = route.params['createByType'];
                    if (!this.idValidationRule.isValid(type)) {
                        console.warn('warning no valid type for cdoc:', LogUtils.sanitizeLogMsg(type));
                        result.error = new ResolverError(AbstractCommonDocRecordCreateResolver.ERROR_UNKNOWN_DOC_TYPE, type, undefined);
                        return resolve(result);
                    }

                    const values = { type: type.toUpperCase(), keywords: ''};

                    const baseId = route.params['createBaseId'];
                    if (baseId && this.idValidationRule.isValid(baseId)) {
                        this.dataService.getById(baseId).then(
                            function doneGetById(cdoc: R) {
                                if (cdoc === undefined) {
                                    console.log('no cdoc for id:' + LogUtils.sanitizeLogMsg(baseId));
                                    result.error = new ResolverError(AbstractCommonDocRecordResolver.ERROR_UNKNOWN_DOC_ID, baseId, undefined);
                                    return resolve(result);
                                }

                                const fields = ['name', 'keywords', 'descTxt', 'descMd'];
                                me.configureDefaultFieldToSet(type, fields);
                                me.copyDefaultFields(type, cdoc, values);

                                for (const field of fields) {
                                    values[field] = BeanUtils.getValue(cdoc, field);
                                }

                                result.data = me.dataService.newRecord(values);

                                return resolve(result);
                            }).catch(function errorGetById(reason: any) {
                                console.error('error cdoc for id:' + LogUtils.sanitizeLogMsg(baseId), reason);
                                result.error = new ResolverError(AbstractCommonDocRecordResolver.ERROR_READING_DOC_ID, baseId, reason);
                                return resolve(result);
                            }
                        );
                    } else {
                        me.setDefaultFields(type, values);
                        result.data = me.dataService.newRecord(values);
                        return resolve(result);
                    }

                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }

    protected configureDefaultFieldToSet(type: string, fields: string[]): void {
    }

    protected copyDefaultFields(type: string, cdoc: R, values: {}): void {
    }

    protected setDefaultFields(type: string, values: {}): void {
    }
}
