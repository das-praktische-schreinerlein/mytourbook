import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocDateTechRecord} from '../../../../shared/sdoc-commons/model/records/sdocdatetech-record';

@Component({
    selector: 'app-sdoc-datetech',
    templateUrl: './sdoc-datetech.component.html',
    styleUrls: ['./sdoc-datetech.component.css']
})
export class SDocDateTechComponent implements OnChanges {
    sdocdatetech: SDocDateTechRecord;

    @Input()
    public record: SDocRecord;

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        if (this.record === undefined) {
            this.sdocdatetech = undefined;
            return;
        }
        this.sdocdatetech = this.record['sdocdatetech'];
    }
}
