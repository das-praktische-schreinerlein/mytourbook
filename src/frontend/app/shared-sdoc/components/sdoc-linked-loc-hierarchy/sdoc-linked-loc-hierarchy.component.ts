import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CommonDocRoutingService} from '../../services/cdoc-routing.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-linked-loc-hierarchy',
    templateUrl: './sdoc-linked-loc-hierarchy.component.html',
    styleUrls: ['./sdoc-linked-loc-hierarchy.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocLinkedLocHierarchyComponent implements OnChanges {
    locations: any[];

    @Input()
    public record: SDocRecord;

    @Input()
    public lastOnly? = false;

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private cdocRoutingService: CommonDocRoutingService, private contentUtils: SDocContentUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateLocation();
        }
    }

    private updateLocation() {
        if (this.record === undefined || this.record.type === 'NEWS') {
            this.locations = [];
            return;
        }
        this.locations = this.contentUtils.getLocationHierarchy(this.record, this.lastOnly);
    }

    public submitShow(event, location): boolean {
        this.commonRoutingService.navigateByUrl(this.getUrl(location));
        return false;
    }

    public getShowUrl(location: any): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(location));
    }

    private getUrl(location: any): string {
        return this.cdocRoutingService.getShowUrl(new SDocRecord({id: location[0], name: location[1], type: 'LOCATION'}), '');
    }

}
