import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-linked-loc-hierarchy',
    templateUrl: './sdoc-linked-loc-hierarchy.component.html',
    styleUrls: ['./sdoc-linked-loc-hierarchy.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocLinkedLocHierarchyComponent extends AbstractInlineComponent {
    locations: any[];

    @Input()
    public record: SDocRecord;

    @Input()
    public lastOnly? = false;

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private cdocRoutingService: CommonDocRoutingService, private contentUtils: SDocContentUtils,
                protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
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
