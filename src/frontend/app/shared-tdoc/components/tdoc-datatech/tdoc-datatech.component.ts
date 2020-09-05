import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataTechRecordType} from '../../../../shared/tdoc-commons/model/records/tdocdatatech-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-datatech',
    templateUrl: './tdoc-datatech.component.html',
    styleUrls: ['./tdoc-datatech.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocDataTechComponent extends AbstractInlineComponent {
    tdocdatatech: TourDocDataTechRecordType;

    @Input()
    public record: TourDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.tdocdatatech = undefined;
            return;
        }
        this.tdocdatatech = this.record['tdocdatatech'];
    }
}
