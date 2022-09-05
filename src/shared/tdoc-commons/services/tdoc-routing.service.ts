import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Injectable} from '@angular/core';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocDataService} from './tdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {DataMode} from '../model/datamode.enum';

@Injectable()
export class TourDocRoutingService extends CommonDocRoutingService {

    constructor(protected commonRoutingService: CommonRoutingService,
                protected genericAppService: GenericAppService,
                protected tourDocDataService: TourDocDataService,
                protected toastr: ToastrService) {
        super(commonRoutingService);
        this.lastSearchUrl = '/tdoc/search/';
        this.lastAdminBaseUrl = '/tdocadmin/';
        this.lastBaseUrl = '/tdoc/';
    }

    navigateToShow(cdoc: CommonDocRecord, from: string): Promise<boolean> {
        const me = this;
        const appConfig = this.genericAppService.getAppConfig();
        if (appConfig && DataMode.STATIC === appConfig['currentDataMode']) {
            return this.tourDocDataService.getById(cdoc.id).then(record => {
                if (record == null) {
                    console.log('record not found:', cdoc.id);
                    me.toastr.error('Dieser Datensatz ist leider nicht Teil der Datenbank :-(');
                    return Promise.resolve(true);
                }

                return this.commonRoutingService.navigateByUrl(this.getShowUrl(cdoc, from));
            }).catch(reason => {
                console.log('record not found:', cdoc.id, reason);
                me.toastr.error('Dieser Datensatz ist leider nicht Teil der Datenbank :-(');
                return Promise.resolve(true);
            });
        }

        return this.commonRoutingService.navigateByUrl(this.getShowUrl(cdoc, from));
    }

}
