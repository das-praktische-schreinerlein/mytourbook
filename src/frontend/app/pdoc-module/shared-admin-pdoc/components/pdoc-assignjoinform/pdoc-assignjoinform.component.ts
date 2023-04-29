import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {
    CommonDocAssignJoinFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component';

@Component({
    selector: 'app-pdoc-assignjoinform',
    templateUrl: '../../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component.html',
    styleUrls: ['../../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocAssignJoinFormComponent
    extends CommonDocAssignJoinFormComponent<PDocRecord, PDocSearchForm, PDocSearchResult, PDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, pdocDataService: PDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, pdocDataService, toastr);
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
