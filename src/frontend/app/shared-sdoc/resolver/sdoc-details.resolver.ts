import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';

@Injectable()
export class SDocRecordResolver implements Resolve<SDocRecord> {
    constructor(private appService: GenericAppService, private sdocDataService: SDocDataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SDocRecord> {
        return new Promise<SDocRecord>((resolve, reject) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    const id = route.params['id'];
                    this.sdocDataService.getById(id).then(
                        function doneGetById(sdoc: SDocRecord) {
                            resolve(sdoc);
                        },
                        function errorGetById(reason: any) {
                            reject(reason);
                        }
                    );
                }
            });
        });
    }
}
