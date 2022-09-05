import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {TourDocLinkedInfoRecord} from '../../../../shared/tdoc-commons/model/records/tdoclinkedinfo-record';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';

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
                private cdocRoutingService: TourDocRoutingService,
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
        this.cdocRoutingService.navigateToShow(this.generateRecord(info), '');
        return false;
    }

    public getShowUrl(info: TourDocLinkedInfoRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(info));
    }

    private getUrl(info: TourDocLinkedInfoRecord): string {
        return this.cdocRoutingService.getShowUrl(this.generateRecord(info), '');
    }

    private generateRecord(info: any): TourDocRecord {
        return new TourDocRecord({id: 'INFO_' + info.refId, name: info.name, type: 'INFO'});
    }
}
