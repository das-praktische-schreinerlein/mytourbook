import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {BaseObjectDetectionImageObjectRecordType} from '../../../../shared/tdoc-commons/model/records/baseobjectdetectionimageobject-record';

@Component({
    selector: 'app-tdoc-odobjectdetails',
    templateUrl: './tdoc-odobjectdetails.component.html',
    styleUrls: ['./tdoc-odobjectdetails.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocODObjectDetailsComponent extends AbstractInlineComponent {

    @Input()
    public objects: BaseObjectDetectionImageObjectRecordType[];

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
    }
}
