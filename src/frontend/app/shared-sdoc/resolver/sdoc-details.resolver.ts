import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';

@Injectable()
export class SDocRecordResolver implements Resolve<ResolvedData<SDocRecord>> {
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
                        console.error('error no id for sdoc:', id);
                        result.error = new ResolverError(SDocRecordResolver.ERROR_INVALID_SDOC_ID, id, undefined);
                        resolve(result);
                        return;
                    }

                    id = this.idValidationRule.sanitize(id);
                    this.dataService.getById(id).then(
                        function doneGetById(sdoc: SDocRecord) {
                            if (sdoc === undefined) {
                                console.error('error no sdoc for id:' + id);
                                result.error = new ResolverError(SDocRecordResolver.ERROR_UNKNOWN_SDOC_ID, id, undefined);
                                resolve(result);
                                return;
                            }

                            result.data = sdoc;
                            resolve(result);
                            return;
                        }).catch(function errorGetById(reason: any) {
                            console.error('error sdoc for id:' + id, reason);
                            result.error = new ResolverError(SDocRecordResolver.ERROR_READING_SDOC_ID, id, reason);
                            resolve(result);
                            return;
                        }
                    );
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    resolve(result);
                    return;
                }
            });
        });
    }
}
