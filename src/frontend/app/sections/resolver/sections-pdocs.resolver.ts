import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocRecord} from '../../../shared/pdoc-commons/model/records/pdoc-record';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';

@Injectable()
export class SectionsPDocsResolver implements Resolve<ResolvedData<PDocRecord[]>> {
    static ERROR_READING_SECTIONS = 'ERROR_READING_SECTIONS';

    constructor(private appService: GenericAppService, private dataService: PDocDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<PDocRecord[]>> {
        const result: ResolvedData<PDocRecord[]> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<PDocRecord[]>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.dataService.getAll(undefined).then(
                        function doneGetAll(pdocs: any) {
                            result.data = pdocs;
                            resolve(result);
                            return;
                        }).catch(function errorGetAll(reason: any) {
                            console.error('error loading pdocs', reason);
                            result.error = new ResolverError(SectionsPDocsResolver.ERROR_READING_SECTIONS, undefined, reason);
                            resolve(result);
                            return;
                        });
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    resolve(result);
                    return;
                }
            });
        });
    }
}
