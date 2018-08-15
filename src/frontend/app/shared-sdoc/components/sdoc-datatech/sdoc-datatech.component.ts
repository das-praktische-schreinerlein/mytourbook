import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDataTechRecord} from '../../../../shared/sdoc-commons/model/records/sdocdatatech-record';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-datatech',
    templateUrl: './sdoc-datatech.component.html',
    styleUrls: ['./sdoc-datatech.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDataTechComponent extends AbstractInlineComponent {
    sdocdatatech: SDocDataTechRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.sdocdatatech = undefined;
            return;
        }
        this.sdocdatatech = this.record['sdocdatatech'];
    }
}
