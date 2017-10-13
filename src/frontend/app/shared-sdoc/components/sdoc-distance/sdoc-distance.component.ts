import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';

@Component({
    selector: 'app-sdoc-distance',
    templateUrl: './sdoc-distance.component.html',
    styleUrls: ['./sdoc-distance.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDistanceComponent implements OnChanges {
    distance: number;

    @Input()
    public record: SDocRecord;

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    calcDistance(distance: number): number {
        return Math.round(distance + 0.5);
    }

    private updateData() {
        if (this.record === undefined) {
            this.distance = undefined;
            return;
        }
        this.distance = this.record['geoDistance'];
    }
}
