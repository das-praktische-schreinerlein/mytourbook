import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {ItemData, SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-listactions',
    templateUrl: './sdoc-listactions.component.html',
    styleUrls: ['./sdoc-listactions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListActionsComponent implements OnInit, OnChanges {
    item: ItemData = {
        currentRecord: undefined,
        styleClassFor: undefined,
        thumbnailUrl: undefined,
        previewUrl: undefined,
        image: undefined,
        urlShow: undefined
    };

    @Input()
    public record: SDocRecord;

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private sdocRoutingService: SDocRoutingService, private contentUtils: SDocContentUtils) {
    }

    ngOnInit() {
        this.updateData();
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    public submitShow(): boolean {
        this.commonRoutingService.navigateByUrl(this.getUrl(this.item.currentRecord));
        return false;
    }

    public getShowUrl(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(this.item.currentRecord));
    }

    private updateData() {
        this.contentUtils.updateItemData(this.item, this.record, 'default');
    }

    private getUrl(sdocToShow: any): string {
        return this.sdocRoutingService.getShowUrl(sdocToShow, '');
    }
}
