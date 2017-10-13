import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocDataInfoRecord} from '../../../../shared/sdoc-commons/model/records/sdocdatainfo-record';

@Component({
    selector: 'app-sdoc-datainfo',
    templateUrl: './sdoc-datainfo.component.html',
    styleUrls: ['./sdoc-datainfo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDataInfoComponent implements OnChanges {
    sdocdatainfo: SDocDataInfoRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

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
    }
}
