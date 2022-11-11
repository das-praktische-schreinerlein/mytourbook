import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {
    CommonDocAssignJoinFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component';

@Component({
    selector: 'app-tdoc-assignjoinform',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocAssignJoinFormComponent
    extends CommonDocAssignJoinFormComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, tdocDataService: TourDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, tdocDataService, toastr);
    }

    protected getReferenceNamesForRecordType(type: string): string[] {
        switch (type) {
            case 'ROUTE':
            case 'LOCATION':
                return ['info_id_is'];
            default:
                return undefined;
        }
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        return super.generateSelectIdValues(facetName, keyValues);
    }
}
