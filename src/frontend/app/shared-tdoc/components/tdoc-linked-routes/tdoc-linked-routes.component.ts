import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {TourDocLinkedRouteRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedroute-record';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';

@Component({
    selector: 'app-tdoc-linked-routes',
    templateUrl: './tdoc-linked-routes.component.html',
    styleUrls: ['./tdoc-linked-routes.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocLinkedRoutesComponent extends AbstractInlineComponent {
    linkedRoutes: TourDocLinkedRouteRecord[];

    @Input()
    public record: TourDocRecord;

    @Input()
    public small ? = false;

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private cdocRoutingService: TourDocRoutingService,
                protected cd: ChangeDetectorRef) {
        super(cd);
    }
    protected updateData(): void {
        if (this.record === undefined || this.record['tdoclinkedroutes'] === undefined || this.record['tdoclinkedroutes'].length <= 0) {
            this.linkedRoutes = [];
            return;
        }

        const routes = [];
        const routeKeys = {};
        for (const linkedRoute of this.record['tdoclinkedroutes']) {
            const routeKey = linkedRoute.name + linkedRoute.refId + linkedRoute.linkedRouteAttr;
            if (routeKeys[routeKey]) {
                continue;
            }

            routeKeys[routeKey] = linkedRoute;
            routes.push(linkedRoute);
        }

        this.linkedRoutes = routes;
    }

    public submitShow(event, route: TourDocLinkedRouteRecord): boolean {
        this.cdocRoutingService.navigateToShow(this.generateRecord(route), '');
        return false;
    }

    public getShowUrl(route: TourDocLinkedRouteRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(route));
    }

    private getUrl(route: TourDocLinkedRouteRecord): string {
        return this.cdocRoutingService.getShowUrl(this.generateRecord(route), '');
    }

    private generateRecord(route: any): TourDocRecord {
        return new TourDocRecord(new TourDocRecord({id: 'ROUTE_' + route.refId, name: route.name, type: 'ROUTE'}));
    }
}
