import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SDocSearchFormConverter} from '../services/sdoc-searchform-converter.service';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {ResolvedData} from '../../../shared/angular-commons/resolver/resolver.utils';

@Injectable()
export class SDocSearchFormResolver implements Resolve<ResolvedData<SDocSearchForm>> {
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
                    result.data = searchForm;
                    resolve(result);
                }
            });
        });
    }
}
