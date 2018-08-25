import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {BaseRatePersonalRecordType} from '../../../../shared/tdoc-commons/model/records/baseratepers-record';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-ratepers',
    templateUrl: './tdoc-ratepers.component.html',
    styleUrls: ['./tdoc-ratepers.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocRatePersonalComponent extends AbstractInlineComponent {
    tdocratepers: BaseRatePersonalRecordType;

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
