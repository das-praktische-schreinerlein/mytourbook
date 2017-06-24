import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SDocSearchFormConverter} from '../services/sdoc-searchform-converter.service';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {AppService, AppState} from '../services/app.service';

@Injectable()
export class SDocSearchFormResolver implements Resolve<SDocSearchForm> {
    constructor(private appService: AppService, private searchFormConverter: SDocSearchFormConverter) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SDocSearchForm> {
        return new Promise<SDocSearchForm>((resolve, reject) => {
            const searchForm = new SDocSearchForm({});
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.searchFormConverter.paramsToSearchForm(route.params, route.data['searchFormDefaults'], searchForm);
                    resolve(<SDocSearchForm>searchForm);
                }
            });
        });
    }
}
