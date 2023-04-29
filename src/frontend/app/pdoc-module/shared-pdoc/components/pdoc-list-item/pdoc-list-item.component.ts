import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Layout, LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {
    CommonDocListItemComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list-item/cdoc-list-item.component';
import {PDocContentUtils} from '../../services/pdoc-contentutils.service';
import {PDocRoutingService} from '../../services/pdoc-routing.service';

@Component({
    selector: 'app-pdoc-list-item',
    templateUrl: './pdoc-list-item.component.html',
    styleUrls: ['./pdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocListItemComponent extends CommonDocListItemComponent {
    @Input()
    public record: PDocRecord;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<PDocRecord> = new EventEmitter();

    constructor(contentUtils: PDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService,
                private sanitizer: DomSanitizer, private cdocRoutingService: PDocRoutingService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'default';
    }

    public submitShow(pdoc: PDocRecord) {
        this.show.emit(pdoc);
        return false;
    }

    public getShowUrl(info: PDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(info));
    }

    private getUrl(pdoc: PDocRecord): string {
        return this.cdocRoutingService.getShowUrl(pdoc, '');
    }

}
