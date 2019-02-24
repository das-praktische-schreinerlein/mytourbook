import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {BaseObjectDetectionImageObjectRecordType} from '../../../../shared/tdoc-commons/model/records/baseobjectdetectionimageobject-record';

@Component({
    selector: 'app-tdoc-odobjectrectangles',
    templateUrl: './tdoc-odobjectrectangles.component.html',
    styleUrls: ['./tdoc-odobjectrectangles.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocODObjectRectanglesComponent extends AbstractInlineComponent {

    @Input()
    public width: number;

    @Input()
    public objects: BaseObjectDetectionImageObjectRecordType[];

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
    }
}
