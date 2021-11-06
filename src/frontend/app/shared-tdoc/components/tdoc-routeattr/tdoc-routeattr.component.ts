import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-tdoc-routeattr',
    templateUrl: './tdoc-routeattr.component.html',
    styleUrls: ['./tdoc-routeattr.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocRouteAttributeComponent extends AbstractInlineComponent {
    routeAttrs: any[];

    @Input()
    public record: TourDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined || this.record.linkedRouteAttr === undefined || this.record.linkedRouteAttr.length <= 0) {
            this.routeAttrs = [];
            return;
        }

        this.routeAttrs = this.record.linkedRouteAttr.split(/;;/);
    }
}
