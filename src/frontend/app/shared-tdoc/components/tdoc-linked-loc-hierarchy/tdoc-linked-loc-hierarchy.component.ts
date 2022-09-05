import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';

@Component({
    selector: 'app-tdoc-linked-loc-hierarchy',
    templateUrl: './tdoc-linked-loc-hierarchy.component.html',
    styleUrls: ['./tdoc-linked-loc-hierarchy.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocLinkedLocHierarchyComponent extends AbstractInlineComponent {
    locations: any[];

    @Input()
    public record: TourDocRecord;

    @Input()
    public lastOnly ? = false;

    @Input()
    public truncateMaxWordLength ? = undefined;

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private cdocRoutingService: TourDocRoutingService, private contentUtils: TourDocContentUtils,
                protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined || this.record.type === 'NEWS') {
            this.locations = [];
            return;
        }

        this.locations = this.contentUtils.getLocationHierarchy(this.record, this.lastOnly,
            this.truncateMaxWordLength !== undefined, this.truncateMaxWordLength);
    }

    public submitShow(event, location): boolean {
        this.cdocRoutingService.navigateToShow(this.generateRecord(location), '');
        return false;
    }

    public getShowUrl(location: any): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(location));
    }

    private getUrl(location: any): string {
        return this.cdocRoutingService.getShowUrl(this.generateRecord(location), '');
    }

    private generateRecord(location: any): TourDocRecord {
        return new TourDocRecord({id: location[0], name: location[1], type: 'LOCATION'});
    }

}
