import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../commons/services/generic-app.service';
import {ResolvedData, ResolverError} from '../../angular-commons/resolver/resolver.utils';
import {IdValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {CommonDocSearchForm} from '../../search-commons/model/forms/cdoc-searchform';
import {GenericSearchFormSearchFormConverter} from '../../search-commons/services/generic-searchform.converter';

export abstract class CommonSectionSearchFormResolver<F extends CommonDocSearchForm> implements Resolve<ResolvedData<F>> {
    static ERROR_INVALID_SEARCHFORM_SECTION_ID = 'ERROR_INVALID_SEARCHFORM_SECTION_ID';
    static ERROR_INVALID_SEARCHFORM = 'ERROR_INVALID_SEARCHFORM';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private searchFormConverter: GenericSearchFormSearchFormConverter<F>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<F>> {
        const me = this;
        const result: ResolvedData<F> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<F>>((resolve) => {
            const id: string = route.params['section'] || route.parent.params['section'];

            const searchForm = this.searchFormConverter.newSearchForm({});
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.searchFormConverter.paramsToSearchForm(route.params, route.data['searchFormDefaults'], searchForm);
                    searchForm.theme = this.idValidationRule.sanitize(id);
                    if (!this.searchFormConverter.isValid(searchForm)) {
                        result.error = new ResolverError(CommonSectionSearchFormResolver.ERROR_INVALID_SEARCHFORM, searchForm,
                            undefined);
                        return resolve(result);
                    }
                    if (!this.idValidationRule.isValid(id)) {
                        result.error = new ResolverError(CommonSectionSearchFormResolver.ERROR_INVALID_SEARCHFORM_SECTION_ID,
                            searchForm, undefined);
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
