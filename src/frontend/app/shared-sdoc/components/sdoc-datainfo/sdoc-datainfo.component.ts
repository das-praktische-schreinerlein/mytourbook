import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocDataInfoRecord} from '../../../../shared/sdoc-commons/model/records/sdocdatainfo-record';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
    selector: 'app-sdoc-datainfo',
    templateUrl: './sdoc-datainfo.component.html',
    styleUrls: ['./sdoc-datainfo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDataInfoComponent implements OnChanges {
    sdocdatainfo: SDocDataInfoRecord;
    guides: SafeHtml = '';

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        if (this.record === undefined) {
            this.sdocdatainfo = undefined;
            return;
        }
        this.sdocdatainfo = this.record['sdocdatainfo'];
        this.guides = this.sdocdatainfo ? this.sanitizer.bypassSecurityTrustHtml(this.sdocdatainfo.guides) : '';
    }
}
