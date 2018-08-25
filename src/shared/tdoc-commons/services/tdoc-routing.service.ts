import {CommonDocRoutingService} from '../../frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '../../angular-commons/services/common-routing.service';
import {Injectable} from '@angular/core';

@Injectable()
export class TourDocRoutingService extends CommonDocRoutingService {

    constructor(protected commonRoutingService: CommonRoutingService) {
        super(commonRoutingService);
        this.lastSearchUrl = '/tdoc/search/';
        this.lastBaseUrl = '/tdoc/';
    }
}
