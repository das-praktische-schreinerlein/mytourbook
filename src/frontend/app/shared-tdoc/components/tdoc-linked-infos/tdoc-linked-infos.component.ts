import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord, TourDocRecordType} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer, SafeHtml, SafeUrl} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {TourDocInfoRecordType} from '../../../../shared/tdoc-commons/model/records/tdocinfo-record';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {TourDocLinkedInfoRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedinfo-record';

@Component({
    selector: 'app-tdoc-linked-infos',
    templateUrl: './tdoc-linked-infos.component.html',
    styleUrls: ['./tdoc-linked-infos.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocLinkedInfosComponent extends AbstractInlineComponent {
    linkedInfos: TourDocLinkedInfoRecord[];

    @Input()
    public record: TourDocRecord;

    @Input()
    public small ? = false;

    constructor(private sanitizer: DomSanitizer, private commonRoutingService: CommonRoutingService,
                private cdocRoutingService: CommonDocRoutingService, private contentUtils: TourDocContentUtils,
                protected cd: ChangeDetectorRef) {
        super(cd);
    }
    protected updateData(): void {
        if (this.record === undefined || this.record['tdoclinkedinfos'] === undefined || this.record['tdoclinkedinfos'].length <= 0) {
            this.linkedInfos = [];
            return;
        }

        this.linkedInfos = this.record['tdoclinkedinfos'];
    }

    public submitShow(event, info: TourDocLinkedInfoRecord): boolean {
        this.commonRoutingService.navigateByUrl(this.getUrl(info));
        return false;
    }

    public getShowUrl(info: TourDocLinkedInfoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(info));
    }

    private getUrl(info: TourDocLinkedInfoRecord): string {
        return this.cdocRoutingService.getShowUrl(new TourDocRecord({id: 'INFO_' + info.refId, name: info.name, type: 'INFO'}), '');
    }

}
