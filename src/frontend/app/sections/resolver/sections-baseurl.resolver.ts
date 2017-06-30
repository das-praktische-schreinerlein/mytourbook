import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class SectionsBaseUrlResolver implements Resolve<string> {
    constructor() {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
        return new Promise<string>((resolve, reject) => {
                    resolve('sections/' + (route.params['section'] || route.parent.params['section']) + '/');
        });
    }
}
