import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';

@Component({
    selector: 'app-sdoc-showpage',
    templateUrl: './sdoc-showpage.component.html',
    styleUrls: ['./sdoc-showpage.component.css']
})
export class SDocShowpageComponent implements OnInit, OnDestroy {
    public record: SDocRecord;
    public Layout = Layout;

    constructor(private route: ActivatedRoute,
                private sdocDataService: SDocDataService, private sdocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef) {
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

    onEditSDoc(sdoc: SDocRecord) {
        this.sdocRoutingService.navigateToEdit(sdoc.id, '');
        return false;
    }

    onDeleteSDoc(sdoc: SDocRecord) {
        if (window.confirm('SDoc wirklich löschen?')) {
            const me = this;
            this.sdocDataService.deleteById(sdoc.id).then(function doneDeleteById() {
                    console.log('SDoc deleted', sdoc);
                    me.toastr.info('Datesatz wurde gelöscht.', 'Fertig');
                    me.sdocRoutingService.navigateBackToFrom(me.route);
                },
                function errorCreate(reason: any) {
                    console.error('deleteSDocById failed:' + reason);
                    me.toastr.error('Es gab leider ein Problem beim Löschen - am besten noch einmal probieren :-(', 'Oops!');
                }
            );
        }

        return false;
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
            filters['moreFilter'] = 'track_id_i:' + record.trackId;
            if (type === 'IMAGE') {
                filters['perPage'] = 999;
            } else if (type === 'ROUTE') {
                filters['perPage'] = 999;
            }
        } else if (this.record.type === 'ROUTE') {
            filters['moreFilter'] = 'route_id_i:' + record.routeId;
            if (type === 'IMAGE') {
                filters['perPage'] = 30;
            } else if (type === 'TRACK') {
                filters['perPage'] = 999;
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
            filters['moreFilter'] = 'image_id_i:' + record.imageId;
        }

        return filters;
    }
}
