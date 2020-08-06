import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocRateTechRecordType} from '../../../../shared/tdoc-commons/model/records/tdocratetech-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-ratetech',
    templateUrl: './tdoc-ratetech.component.html',
    styleUrls: ['./tdoc-ratetech.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocRateTechComponent extends AbstractInlineComponent {
    tdocratetech: TourDocRateTechRecordType;

    @Input()
    public record: TourDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.tdocratetech = undefined;
            return;
        }
        this.tdocratetech = this.record['tdocratetech'];
    }
}
