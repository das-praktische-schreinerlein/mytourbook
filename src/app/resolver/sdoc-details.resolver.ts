import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppService, AppState} from '../services/app.service';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocDataService} from '../services/sdoc-data.service';

@Injectable()
export class SDocRecordResolver implements Resolve<SDocRecord> {
    constructor(private appService: AppService, private sdocDataService: SDocDataService) {}

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
