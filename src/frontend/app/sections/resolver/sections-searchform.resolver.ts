import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SDocSearchFormConverter} from '../../shared-sdoc/services/sdoc-searchform-converter.service';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';

@Injectable()
export class SectionsSearchFormResolver implements Resolve<ResolvedData<SDocSearchForm>> {
    static ERROR_INVALID_SECTION_ID = 'ERROR_INVALID_SECTION_ID';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private searchFormConverter: SDocSearchFormConverter) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<SDocSearchForm>> {
        const me = this;
        const result: ResolvedData<SDocSearchForm> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<SDocSearchForm>>((resolve) => {
            let id: string = route.params['section'] || route.parent.params['section'];
            if (!this.idValidationRule.isValid(id)) {
                result.error = new ResolverError(SectionsSearchFormResolver.ERROR_INVALID_SECTION_ID, id, undefined);
                resolve(result);
                return;
            }

            id = this.idValidationRule.sanitize(id);
            const searchForm = new SDocSearchForm({});
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.searchFormConverter.paramsToSearchForm(route.params, route.data['searchFormDefaults'], searchForm);
                    searchForm.theme = id;
                    result.data = searchForm;
                    resolve(result);
                }
            });
        });
    }
}
