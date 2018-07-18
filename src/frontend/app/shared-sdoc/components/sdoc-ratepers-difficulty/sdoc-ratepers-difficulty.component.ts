import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocRatePersonalRecord} from '../../../../shared/sdoc-commons/model/records/sdocratepers-record';
import {CommonDocContentUtils} from '../../../../shared/frontend-commons/services/cdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-ratepers-difficulty',
    templateUrl: './sdoc-ratepers-difficulty.component.html',
    styleUrls: ['./sdoc-ratepers-difficulty.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocRatePersonalDifficultyComponent implements OnChanges {
    sdocratepers: SDocRatePersonalRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(private contentUtils: CommonDocContentUtils) {}

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
