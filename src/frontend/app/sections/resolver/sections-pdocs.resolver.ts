import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocRecord} from '../../../shared/pdoc-commons/model/records/pdoc-record';

@Injectable()
export class SectionsPDocsResolver implements Resolve<PDocRecord[]> {
    constructor(private appService: GenericAppService, private pdocDataService: PDocDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PDocRecord[]> {
        return new Promise<PDocRecord[]>((resolve, reject) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    this.pdocDataService.getAll().then(
                        function doneGetAll(pdocs: PDocRecord[]) {
                            resolve(pdocs);
                        },
                        function errorGetAll(reason: any) {
                            console.error('error pdocs', reason);
                            reject(reason);
                        }
                    );
                }
            });
        });
    }
}
