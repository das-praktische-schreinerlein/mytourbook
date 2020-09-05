import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord, TourDocRecordType} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-datameta',
    templateUrl: './tdoc-datameta.component.html',
    styleUrls: ['./tdoc-datameta.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocDataMetaComponent extends AbstractInlineComponent {
    tdocdatameta: TourDocRecordType;

    @Input()
    public record: TourDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.tdocdatameta = undefined;
            return;
        }
        this.tdocdatameta = this.record;
    }
}
