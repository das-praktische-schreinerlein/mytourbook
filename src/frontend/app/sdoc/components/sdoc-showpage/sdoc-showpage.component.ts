import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {Layout} from '../../../shared-sdoc/components/sdoc-list/sdoc-list.component';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-showpage',
    templateUrl: './sdoc-showpage.component.html',
    styleUrls: ['./sdoc-showpage.component.css']
})
export class SDocShowpageComponent implements OnInit, OnDestroy {
    public contentUtils: SDocContentUtils;
    public record: SDocRecord;
    public Layout = Layout;

    constructor(private route: ActivatedRoute, private sdocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: SDocContentUtils) {
        this.contentUtils = contentUtils;
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { record: SDocRecord }) => {
                me.record = data.record;
            },
            (error: {reason: any}) => {
                me.toastr.error('Es gibt leider Probleme bei der Lesen - am besten noch einmal probieren :-(', 'Oops!');
                console.error('show getById failed:' + error.reason);
            }
        );
    }

    ngOnDestroy() {
    }

    submitBackToSearch() {
        this.sdocRoutingService.navigateBackToSearch();
        return false;
    }

    getBackToSearchUrl(): string {
        return this.sdocRoutingService.getLastSearchUrl();
    }

    getFiltersForType(record: SDocRecord, type: string): any {
        const filters = {
            type: type
        };

        if (this.record.type === 'TRACK') {
            if (type === 'IMAGE' && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
                filters['perPage'] = 999;
            } else if (type === 'ROUTE' && record.routeId) {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 999;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            }
        } else if (this.record.type === 'ROUTE') {
            if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else if (type === 'IMAGE') {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 30;
            } else if (type === 'TRACK') {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
                filters['perPage'] = 999;
            } else {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
            }
        } else if (this.record.type === 'LOCATION') {
            if (type === 'LOCATION') {
                filters['moreFilter'] = 'loc_parent_id_i:' + record.locId;
            } else {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
                if (type === 'IMAGE') {
                    filters['perPage'] = 30;
                }
            }
        } else if (this.record.type === 'IMAGE') {
            if (type === 'TRACK' && record.trackId) {
                filters['moreFilter'] = 'track_id_i:' + record.trackId;
            } else if (type === 'ROUTE' && record.routeId) {
                filters['moreFilter'] = 'route_id_i:' + record.routeId;
            } else if (type === 'LOCATION' && record.locId) {
                filters['moreFilter'] = 'loc_id_i:' + record.locId;
            } else {
                filters['moreFilter'] = 'image_id_i:' + record.imageId;
            }
        }

        return filters;
    }
}
