import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '@dps/mycms-frontend-commons/dist/angular-commons/resolver/resolver.utils';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';

@Injectable()
export class SectionsTourDocRecordResolver implements Resolve<ResolvedData<TourDocRecord>> {
    static ERROR_UNKNOWN_TDOC_ID = 'ERROR_UNKNOWN_TDOC_ID';
    static ERROR_INVALID_TDOC_ID = 'ERROR_INVALID_TDOC_ID';
    static ERROR_READING_TDOC_ID = 'ERROR_READING_TDOC_ID';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private dataService: TourDocDataService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<TourDocRecord>> {
        const result: ResolvedData<TourDocRecord> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<TourDocRecord>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    let id = route.params['id'];
                    if (!this.idValidationRule.isValid(id)) {
                        // console.log('error no id for tdoc:', LogUtils.sanitizeLogMsg(id));
                        result.error = new ResolverError(SectionsTourDocRecordResolver.ERROR_INVALID_TDOC_ID, id, undefined);
                        return resolve(result);
                    }

                    id = this.idValidationRule.sanitize(id);
                    this.dataService.getById(id).then(
                        function doneGetById(tdoc: TourDocRecord) {
                            if (tdoc === undefined) {
                                console.warn('warning no tdoc for id:' + LogUtils.sanitizeLogMsg(id));
                                result.error = new ResolverError(SectionsTourDocRecordResolver.ERROR_UNKNOWN_TDOC_ID, id, undefined);
                                return resolve(result);
                            }

                            result.data = tdoc;
                            return resolve(result);
                        }).catch(function errorGetById(reason: any) {
                            console.error('error tdoc for id:' + LogUtils.sanitizeLogMsg(id), reason);
                            result.error = new ResolverError(SectionsTourDocRecordResolver.ERROR_READING_TDOC_ID, id, reason);
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
