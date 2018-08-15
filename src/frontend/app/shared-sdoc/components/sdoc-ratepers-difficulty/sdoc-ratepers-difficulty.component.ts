import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocRatePersonalRecord} from '../../../../shared/sdoc-commons/model/records/sdocratepers-record';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-ratepers-difficulty',
    templateUrl: './sdoc-ratepers-difficulty.component.html',
    styleUrls: ['./sdoc-ratepers-difficulty.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocRatePersonalDifficultyComponent extends AbstractInlineComponent {
    sdocratepers: SDocRatePersonalRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(private contentUtils: SDocContentUtils, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    calcRate(rate: number): number {
        return this.contentUtils.calcRate(rate, 5);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.sdocratepers = undefined;
            return;
        }
        this.sdocratepers = this.record['sdocratepers'];
    }
}
