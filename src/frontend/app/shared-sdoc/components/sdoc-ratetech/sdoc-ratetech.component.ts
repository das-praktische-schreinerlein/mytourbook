import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocRateTechRecord} from '../../../../shared/sdoc-commons/model/records/sdoctechrate-record';

@Component({
    selector: 'app-sdoc-ratetech',
    templateUrl: './sdoc-ratetech.component.html',
    styleUrls: ['./sdoc-ratetech.component.css']
})
export class SDocRateTechComponent implements OnChanges {
    sdocratetech: SDocRateTechRecord;

    @Input()
    public record: SDocRecord;

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        if (this.record === undefined) {
            this.sdocratetech = undefined;
            return;
        }
        this.sdocratetech = this.record['sdocratetech'];
    }
}
