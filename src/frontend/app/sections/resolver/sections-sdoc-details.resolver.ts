import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';
import {LogUtils} from '../../../shared/commons/utils/log.utils';

@Injectable()
export class SectionsSDocRecordResolver implements Resolve<ResolvedData<SDocRecord>> {
    static ERROR_UNKNOWN_SDOC_ID = 'ERROR_UNKNOWN_SDOC_ID';
    static ERROR_INVALID_SDOC_ID = 'ERROR_INVALID_SDOC_ID';
    static ERROR_READING_SDOC_ID = 'ERROR_READING_SDOC_ID';
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
                    let id = route.params['id'];
                    if (!this.idValidationRule.isValid(id)) {
                        // console.log('error no id for sdoc:', LogUtils.sanitizeLogMsg(id));
                        result.error = new ResolverError(SectionsSDocRecordResolver.ERROR_INVALID_SDOC_ID, id, undefined);
                        return resolve(result);
                    }

                    id = this.idValidationRule.sanitize(id);
                    this.dataService.getById(id).then(
                        function doneGetById(sdoc: SDocRecord) {
                            if (sdoc === undefined) {
                                console.warn('warning no sdoc for id:' + LogUtils.sanitizeLogMsg(id));
                                result.error = new ResolverError(SectionsSDocRecordResolver.ERROR_UNKNOWN_SDOC_ID, id, undefined);
                                return resolve(result);
                            }

                            result.data = sdoc;
                            return resolve(result);
                        }).catch(function errorGetById(reason: any) {
                            console.error('error sdoc for id:' + LogUtils.sanitizeLogMsg(id), reason);
                            result.error = new ResolverError(SectionsSDocRecordResolver.ERROR_READING_SDOC_ID, id, reason);
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
