import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocRateTechRecord} from '../../../../shared/sdoc-commons/model/records/sdocratetech-record';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-ratetech',
    templateUrl: './sdoc-ratetech.component.html',
    styleUrls: ['./sdoc-ratetech.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocRateTechComponent extends AbstractInlineComponent {
    sdocratetech: SDocRateTechRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.sdocratetech = undefined;
            return;
        }
        this.sdocratetech = this.record['sdocratetech'];
    }
}
