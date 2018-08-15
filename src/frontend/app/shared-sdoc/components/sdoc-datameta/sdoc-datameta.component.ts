import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-datameta',
    templateUrl: './sdoc-datameta.component.html',
    styleUrls: ['./sdoc-datameta.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDataMetaComponent extends AbstractInlineComponent {
    sdocdatameta: SDocRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.sdocdatameta = undefined;
            return;
        }
        this.sdocdatameta = this.record;
    }
}
