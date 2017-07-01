import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocRecord} from '../../../shared/pdoc-commons/model/records/pdoc-record';

@Injectable()
export class SectionsPDocRecordResolver implements Resolve<PDocRecord> {
    constructor(private appService: GenericAppService, private pdocDataService: PDocDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PDocRecord> {
        return new Promise<PDocRecord>((resolve, reject) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    const id = route.params['section'] || route.parent.params['section'];
                    this.pdocDataService.getById(id).then(
                        function doneGetById(pdoc: PDocRecord) {
                            resolve(pdoc);
                        },
                        function errorGetById(reason: any) {
                            console.error('error pdoc for id:' + id, reason);
                            reject(reason);
                        }
                    );
                }
            });
        });
    }
}