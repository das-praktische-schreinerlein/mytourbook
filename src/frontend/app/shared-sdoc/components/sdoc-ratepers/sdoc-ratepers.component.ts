import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {BaseRatePersonalRecordType} from '../../../../shared/sdoc-commons/model/records/baseratepers-record';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-ratepers',
    templateUrl: './sdoc-ratepers.component.html',
    styleUrls: ['./sdoc-ratepers.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocRatePersonalComponent implements OnChanges {
    sdocratepers: BaseRatePersonalRecordType;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(private contentUtils: SDocContentUtils) {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    calcRate(rate: number): number {
        return this.contentUtils.calcRate(rate, 5);
    }

    private updateData() {
        if (this.record === undefined) {
            this.sdocratepers = undefined;
            return;
        }
        this.sdocratepers = this.record['sdocratepers'];
    }
}
