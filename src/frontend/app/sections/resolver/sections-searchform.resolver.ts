import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SDocSearchFormConverter} from '../../shared-sdoc/services/sdoc-searchform-converter.service';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';

@Injectable()
export class SectionsSearchFormResolver implements Resolve<SDocSearchForm> {
    constructor(private appService: GenericAppService, private searchFormConverter: SDocSearchFormConverter) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SDocSearchForm> {
        return new Promise<SDocSearchForm>((resolve, reject) => {
            const searchForm = new SDocSearchForm({});
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.searchFormConverter.paramsToSearchForm(route.params, route.data['searchFormDefaults'], searchForm);
                    searchForm.theme = route.params['section'] || route.parent.params['section'];
                    resolve(<SDocSearchForm>searchForm);
                }
            });
        });
    }
}
