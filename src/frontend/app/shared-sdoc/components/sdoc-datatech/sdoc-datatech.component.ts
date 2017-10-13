import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocDataTechRecord} from '../../../../shared/sdoc-commons/model/records/sdocdatatech-record';

@Component({
    selector: 'app-sdoc-datatech',
    templateUrl: './sdoc-datatech.component.html',
    styleUrls: ['./sdoc-datatech.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDataTechComponent implements OnChanges {
    sdocdatatech: SDocDataTechRecord;

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
            this.sdocdatatech = undefined;
            return;
        }
        this.sdocdatatech = this.record['sdocdatatech'];
    }
}
