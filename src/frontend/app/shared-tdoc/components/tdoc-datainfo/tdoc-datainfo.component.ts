import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataInfoRecordType} from '../../../../shared/tdoc-commons/model/records/tdocdatainfo-record';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-datainfo',
    templateUrl: './tdoc-datainfo.component.html',
    styleUrls: ['./tdoc-datainfo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocDataInfoComponent extends AbstractInlineComponent {
    tdocdatainfo: TourDocDataInfoRecordType;
    guides: SafeHtml = '';

    @Input()
    public record: TourDocRecord;

    @Input()
    public small? = false;

    constructor(private sanitizer: DomSanitizer, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.tdocdatainfo = undefined;
            return;
        }
        this.tdocdatainfo = this.record['tdocdatainfo'];
        this.guides = this.tdocdatainfo ? this.sanitizer.bypassSecurityTrustHtml(this.tdocdatainfo.guides) : '';
    }
}
