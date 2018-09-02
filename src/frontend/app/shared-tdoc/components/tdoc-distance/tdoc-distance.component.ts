import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-distance',
    templateUrl: './tdoc-distance.component.html',
    styleUrls: ['./tdoc-distance.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocDistanceComponent extends AbstractInlineComponent {
    distance: number;

    @Input()
    public record: TourDocRecord;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    calcDistance(distance: number): number {
        return Math.round(distance + 0.5);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.distance = undefined;
            return;
        }
        this.distance = this.record['geoDistance'];
    }
}
