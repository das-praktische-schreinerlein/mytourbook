import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Injectable} from '@angular/core';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {ToastrService} from 'ngx-toastr';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';

@Injectable()
export class PDocRoutingService extends CommonDocRoutingService {

    constructor(protected commonRoutingService: CommonRoutingService,
                protected tourDocDataService: PDocDataService,
                protected toastr: ToastrService) {
        super(commonRoutingService);
        this.lastSearchUrl = '/pdoc/search/';
        this.lastAdminBaseUrl = '/pdocadmin/';
        this.lastBaseUrl = '/pdoc/';
    }

    navigateToShow(cdoc: CommonDocRecord, from: string): Promise<boolean> {
        return this.commonRoutingService.navigateByUrl(this.getShowUrl(cdoc, from));
    }

}
