import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';

@Injectable()
export class SectionsBaseUrlResolver implements Resolve<string> {
    idValidationRule = new IdValidationRule(true);
    constructor() {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
        return new Promise<string>((resolve, reject) => {
                    resolve('sections/' + this.idValidationRule.sanitize(route.params['section'] || route.parent.params['section']) + '/');
        });
    }
}
