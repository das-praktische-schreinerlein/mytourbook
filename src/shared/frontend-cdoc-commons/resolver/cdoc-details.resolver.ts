import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../commons/services/generic-app.service';
import {IdValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../angular-commons/resolver/resolver.utils';
import {LogUtils} from '../../commons/utils/log.utils';
import {CommonDocDataService} from '../../search-commons/services/cdoc-data.service';
import {CommonDocSearchResult} from '../../search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '../../search-commons/model/records/cdoc-entity-record';

export abstract class CommonDocRecordResolver<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>>
    implements Resolve<ResolvedData<R>> {
    static ERROR_UNKNOWN_DOC_ID = 'ERROR_UNKNOWN_DOC_ID';
    static ERROR_INVALID_DOC_ID = 'ERROR_INVALID_DOC_ID';
    static ERROR_READING_DOC_ID = 'ERROR_READING_DOC_ID';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private dataService: D) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<R>> {
        const result: ResolvedData<R> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<R>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    let id = route.params['id'];
                    if (!this.idValidationRule.isValid(id)) {
                        console.warn('warning no id for cdoc:', LogUtils.sanitizeLogMsg(id));
                        result.error = new ResolverError(CommonDocRecordResolver.ERROR_INVALID_DOC_ID, id, undefined);
                        return resolve(result);
                    }

                    id = this.idValidationRule.sanitize(id);
                    this.dataService.getById(id).then(
                        function doneGetById(cdoc: R) {
                            if (cdoc === undefined) {
                                console.log('no cdoc for id:' + LogUtils.sanitizeLogMsg(id));
                                result.error = new ResolverError(CommonDocRecordResolver.ERROR_UNKNOWN_DOC_ID, id, undefined);
                                return resolve(result);
                            }

                            result.data = cdoc;
                            return resolve(result);
                        }).catch(function errorGetById(reason: any) {
                            console.error('error cdoc for id:' + LogUtils.sanitizeLogMsg(id), reason);
                            result.error = new ResolverError(CommonDocRecordResolver.ERROR_READING_DOC_ID, id, reason);
                            return resolve(result);
                        }
                    );
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }
}
