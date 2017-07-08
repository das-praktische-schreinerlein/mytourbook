import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';

@Injectable()
export class SectionsBaseUrlResolver implements Resolve<ResolvedData<string>> {
    static ERROR_INVALID_SECTION_ID = 'ERROR_INVALID_SECTION_ID';
    idValidationRule = new IdValidationRule(true);

    constructor() {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<string>> {
        const result: ResolvedData<string> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<string>>((resolve) => {
            let id: string = route.params['section'] || route.parent.params['section'];
            if (!this.idValidationRule.isValid(id)) {
                result.error = new ResolverError(SectionsBaseUrlResolver.ERROR_INVALID_SECTION_ID, id, undefined);
                resolve(result);
                return;
            }

            id = this.idValidationRule.sanitize(id);
            result.data = 'sections/' + id + '/';
            resolve(result);
        });
    }
}
