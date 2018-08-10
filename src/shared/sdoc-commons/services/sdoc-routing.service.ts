import {CommonDocRoutingService} from '../../frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '../../angular-commons/services/common-routing.service';
import {Injectable} from '@angular/core';

@Injectable()
export class SDocRoutingService extends CommonDocRoutingService {

    constructor(protected commonRoutingService: CommonRoutingService) {
        super(commonRoutingService);
        this.lastSearchUrl = '/sdoc/search/';
        this.lastBaseUrl = '/sdoc/';
    }
}
