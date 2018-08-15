import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDataInfoRecord} from '../../../../shared/sdoc-commons/model/records/sdocdatainfo-record';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-datainfo',
    templateUrl: './sdoc-datainfo.component.html',
    styleUrls: ['./sdoc-datainfo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDataInfoComponent extends AbstractInlineComponent {
    sdocdatainfo: SDocDataInfoRecord;
    guides: SafeHtml = '';

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(private sanitizer: DomSanitizer, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.sdocdatainfo = undefined;
            return;
        }
        this.sdocdatainfo = this.record['sdocdatainfo'];
        this.guides = this.sdocdatainfo ? this.sanitizer.bypassSecurityTrustHtml(this.sdocdatainfo.guides) : '';
    }
}
