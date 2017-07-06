import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocRecord} from '../../../shared/pdoc-commons/model/records/pdoc-record';
import {SDocRoutingService} from '../../shared-sdoc/services/sdoc-routing.service';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';

@Injectable()
export class SectionsPDocRecordResolver implements Resolve<PDocRecord> {
    idValidationRule = new IdValidationRule(true);
    constructor(private appService: GenericAppService, private pdocDataService: PDocDataService,
        private sDocRoutingService: SDocRoutingService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PDocRecord> {
        const me = this;
        return new Promise<PDocRecord>((resolve, reject) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    const id = this.idValidationRule.sanitize(route.params['section'] || route.parent.params['section']);
                    this.pdocDataService.getById(id).then(
                        function doneGetById(pdoc: PDocRecord) {
                            if (pdoc.id !== undefined) {
                                me.sDocRoutingService.setLastBaseUrl('sections/' + pdoc.id + '/');
                            }
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
