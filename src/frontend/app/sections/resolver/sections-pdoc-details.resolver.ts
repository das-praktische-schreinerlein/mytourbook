import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocRecord} from '../../../shared/pdoc-commons/model/records/pdoc-record';
import {SDocRoutingService} from '../../shared-sdoc/services/sdoc-routing.service';
import {ResolvedData, ResolverError} from '../../../shared/angular-commons/resolver/resolver.utils';
import {IdValidationRule} from '../../../shared/search-commons/model/forms/generic-validator.util';
import {LogUtils} from '../../../shared/commons/utils/log.utils';

@Injectable()
export class SectionsPDocRecordResolver implements Resolve<ResolvedData<PDocRecord>> {
    static ERROR_UNKNOWN_SECTION_ID = 'ERROR_UNKNOWN_SECTION_ID';
    static ERROR_INVALID_SECTION_ID = 'ERROR_INVALID_SECTION_ID';
    static ERROR_READING_SECTION_ID = 'ERROR_READING_SECTION_ID';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private dataService: PDocDataService,
        private routingService: SDocRoutingService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<PDocRecord>> {
        const me = this;
        const result: ResolvedData<PDocRecord> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<PDocRecord>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    let id = route.params['section'] || route.parent.params['section'];
                    if (!this.idValidationRule.isValid(id)) {
                        // console.error('error no id for pdoc:', id);
                        result.error = new ResolverError(SectionsPDocRecordResolver.ERROR_INVALID_SECTION_ID, id, undefined);
                        return resolve(result);
                    }

                    id = this.idValidationRule.sanitize(id);
                    this.dataService.getById(id).then(
                        function doneGetById(pdoc: PDocRecord) {
                            if (pdoc === undefined) {
                                console.error('error no pdoc for id:' + LogUtils.sanitizeLogMsg(id));
                                result.error = new ResolverError(SectionsPDocRecordResolver.ERROR_UNKNOWN_SECTION_ID, id, undefined);
                                return resolve(result);
                            }

                            if (pdoc.id !== undefined) {
                                me.routingService.setLastBaseUrl('sections/' + pdoc.id + '/');
                            }
                            result.data = pdoc;
                            return resolve(result);
                        }).catch(function errorGetById(reason: any) {
                            console.error('error pdoc for id:' + LogUtils.sanitizeLogMsg(id), reason);
                            result.error = new ResolverError(SectionsPDocRecordResolver.ERROR_READING_SECTION_ID, id, reason);
                            return resolve(result);
                        }
                    );
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }
}
