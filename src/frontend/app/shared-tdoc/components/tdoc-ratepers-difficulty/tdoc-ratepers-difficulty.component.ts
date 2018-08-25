import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocRatePersonalRecord} from '../../../../shared/tdoc-commons/model/records/tdocratepers-record';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

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

    constructor(private contentUtils: TourDocContentUtils, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    calcRate(rate: number): number {
        return this.contentUtils.calcRate(rate, 5);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.tdocratepers = undefined;
            return;
        }
        this.tdocratepers = this.record['tdocratepers'];
    }
}
