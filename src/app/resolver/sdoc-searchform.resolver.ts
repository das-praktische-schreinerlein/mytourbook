import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {SDocSearchFormConverter} from '../services/sdoc-searchform-converter.service';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {AppService, AppState} from '../services/app.service';

@Injectable()
export class SDocSearchFormResolver implements Resolve<SDocSearchForm> {
    constructor(private appService: AppService, private searchFormConverter: SDocSearchFormConverter) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SDocSearchForm> {
        const result = new Promise<SDocSearchForm>((resolve, reject) => {
            const searchForm = new SDocSearchForm({});
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.searchFormConverter.paramsToSearchForm(route.params, searchForm);
                    resolve(<SDocSearchForm>searchForm);
                }
            });
        });

        return result;
    }
}
