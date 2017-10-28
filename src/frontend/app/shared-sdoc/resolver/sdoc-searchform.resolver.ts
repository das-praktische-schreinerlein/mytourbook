import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SDocSearchFormConverter} from '../services/sdoc-searchform-converter.service';
import {SDocSearchForm, SDocSearchFormValidator} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';

@Injectable()
export class SDocSearchFormResolver implements Resolve<ResolvedData<SDocSearchForm>> {
    static ERROR_INVALID_SDOC_SEARCHFORM = 'ERROR_INVALID_SDOC_SEARCHFORM';

    constructor(private appService: GenericAppService, private searchFormConverter: SDocSearchFormConverter) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<SDocSearchForm>> {
        const result: ResolvedData<SDocSearchForm> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<SDocSearchForm>>((resolve) => {
            const searchForm = new SDocSearchForm({});
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.searchFormConverter.paramsToSearchForm(route.params, route.data['searchFormDefaults'], searchForm);
                    if (!SDocSearchFormValidator.isValid(searchForm)) {
                        result.error = new ResolverError(SDocSearchFormResolver.ERROR_INVALID_SDOC_SEARCHFORM, searchForm, undefined);
                        return resolve(result);
                    }

                    result.data = searchForm;
                    return resolve(result);
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }
}
