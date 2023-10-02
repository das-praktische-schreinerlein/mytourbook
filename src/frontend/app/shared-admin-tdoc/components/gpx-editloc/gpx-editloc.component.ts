import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {TourDocRecordFactory} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {AbstractGpxEditLocComponent} from './abstract-gpx-editloc.component';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {DOCUMENT} from '@angular/common';
import {MapDocRecord} from '../../../../shared/tdoc-commons/services/tdoc-data.utils';

@Component({
    selector: 'app-gpx-editloc',
    templateUrl: './gpx-editloc.component.html',
    styleUrls: ['./gpx-editloc.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpxEditLocComponent extends AbstractGpxEditLocComponent {
    constructor(fb: FormBuilder, toastr: ToastrService, cd: ChangeDetectorRef,
                appService: GenericAppService,
                @Inject(DOCUMENT) document) {
        super(fb, toastr, cd, appService, document);
    }
    protected createSanitized(values: {}): MapDocRecord {
        return TourDocRecordFactory.createSanitized(values);
    }
}
