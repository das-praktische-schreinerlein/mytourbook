import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';

@Component({
    selector: 'app-sdoc-datameta',
    templateUrl: './sdoc-datameta.component.html',
    styleUrls: ['./sdoc-datameta.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDataMetaComponent implements OnChanges {
    sdocdatameta: SDocRecord;

    @Input()
    public record: SDocRecord;

    @Input()
    public small? = false;

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        if (this.record === undefined) {
            this.sdocdatameta = undefined;
            return;
        }
        this.sdocdatameta = this.record;
    }
}
