import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';

@Injectable()
export class SDocRecordCreateResolver implements Resolve<ResolvedData<SDocRecord>> {
    static ERROR_UNKNOWN_SDOC_TYPE = 'ERROR_UNKNOWN_SDOC_TYPE';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService) {
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
                        console.error('error no valid type for sdoc:', type);
                        result.error = new ResolverError(SDocRecordCreateResolver.ERROR_UNKNOWN_SDOC_TYPE, type, undefined);
                        return resolve(result);
                    }

                    const values = { type: type.toUpperCase()};
                    if (type.toLowerCase() === 'location') {
                        values['locIdParent'] = 1;
                    }
                    result.data = new SDocRecord(values);
                    return resolve(result);
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }
}
