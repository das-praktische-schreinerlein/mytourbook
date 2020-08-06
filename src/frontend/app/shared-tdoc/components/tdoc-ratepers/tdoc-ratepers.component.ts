import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocRatePersonalRecordType} from '../../../../shared/tdoc-commons/model/records/tdocratepers-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {MathUtils} from '@dps/mycms-commons/dist/commons/utils/math.utils';

@Component({
    selector: 'app-tdoc-ratepers',
    templateUrl: './tdoc-ratepers.component.html',
    styleUrls: ['./tdoc-ratepers.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocRatePersonalComponent extends AbstractInlineComponent {
    tdocratepers: TourDocRatePersonalRecordType;

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
