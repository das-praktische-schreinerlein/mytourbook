import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {AbstractInlineComponent} from '../../../../shared/angular-commons/components/inline.component';

@Component({
    selector: 'app-sdoc-distance',
    templateUrl: './sdoc-distance.component.html',
    styleUrls: ['./sdoc-distance.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocDistanceComponent extends AbstractInlineComponent {
    distance: number;

    @Input()
    public record: SDocRecord;

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
