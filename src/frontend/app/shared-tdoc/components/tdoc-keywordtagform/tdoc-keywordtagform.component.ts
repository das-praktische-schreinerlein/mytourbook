import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CommonDocKeywordTagFormComponent} from '../cdoc-keywordtagform/cdoc-keywordtagform.component';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';

@Component({
    selector: 'app-tdoc-keywordtagform',
    templateUrl: '../cdoc-keywordtagform/cdoc-keywordtagform.component.html',
    styleUrls: ['../cdoc-keywordtagform/cdoc-keywordtagform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocKeywordTagFormComponent
    extends CommonDocKeywordTagFormComponent<TourDocRecord> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                contentUtils: CommonDocContentUtils, toastr: ToastrService) {
        super(fb, activeModal, cd, contentUtils, toastr);
    }

}
