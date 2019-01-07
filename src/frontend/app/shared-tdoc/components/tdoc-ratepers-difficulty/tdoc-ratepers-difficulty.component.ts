import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocRatePersonalRecord} from '../../../../shared/tdoc-commons/model/records/tdocratepers-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {MathUtils} from '@dps/mycms-commons/dist/commons/utils/math.utils';

@Component({
    selector: 'app-tdoc-ratepers-difficulty',
    templateUrl: './tdoc-ratepers-difficulty.component.html',
    styleUrls: ['./tdoc-ratepers-difficulty.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocRatePersonalDifficultyComponent extends AbstractInlineComponent {
    tdocratepers: TourDocRatePersonalRecord;

    @Input()
    public record: TourDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    calcRate(rate: number): number {
        return MathUtils.calcRate(rate, 15, 5);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.tdocratepers = undefined;
            return;
        }
        this.tdocratepers = this.record['tdocratepers'];
    }
}
