import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocRatePersonalRecord} from '../../../../shared/sdoc-commons/model/records/sdocratepers-record';

@Component({
    selector: 'app-sdoc-ratepers-difficulty',
    templateUrl: './sdoc-ratepers-difficulty.component.html',
    styleUrls: ['./sdoc-ratepers-difficulty.component.css']
})
export class SDocRatePersonalDifficultyComponent implements OnChanges {
    sdocratepers: SDocRatePersonalRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    calcRate(rate: number): number {
        // TODO: move to Service
        return Math.round((rate / 3) + 0.5);
    }

    private updateData() {
        if (this.record === undefined) {
            this.sdocratepers = undefined;
            return;
        }
        this.sdocratepers = this.record['sdocratepers'];
    }
}
