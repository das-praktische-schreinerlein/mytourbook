import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {TourDocLinkedPoiRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedpoi-record';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';

@Component({
    selector: 'app-tdoc-linked-pois',
    templateUrl: './tdoc-linked-pois.component.html',
    styleUrls: ['./tdoc-linked-pois.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocLinkedPoisComponent extends AbstractInlineComponent {
    linkedPois: TourDocLinkedPoiRecord[];

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
        if (this.record === undefined || this.record['tdoclinkedpois'] === undefined || this.record['tdoclinkedpois'].length <= 0) {
            this.linkedPois = [];
            return;
        }

        this.linkedPois = this.record['tdoclinkedpois'];
    }

    public submitShow(event, poi: TourDocLinkedPoiRecord): boolean {
        this.cdocRoutingService.navigateToShow(this.generateRecord(poi), '');
        return false;
    }

    public getShowUrl(poi: TourDocLinkedPoiRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(poi));
    }

    private getUrl(poi: TourDocLinkedPoiRecord): string {
        return this.cdocRoutingService.getShowUrl(this.generateRecord(poi), '');
    }

    private generateRecord(poi: any): TourDocRecord {
        return new TourDocRecord({id: 'POI_' + poi.refId, name: poi.name, type: 'POI', geoLoc: poi.geoLoc, ele: poi.geoEle});
    }
}
