import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {
    CommonDocAssignFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-pdoc-assignform',
    templateUrl: '../../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component.html',
    styleUrls: ['../../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocAssignFormComponent
    extends CommonDocAssignFormComponent<PDocRecord, PDocSearchForm, PDocSearchResult, PDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, pdocDataService: PDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, pdocDataService, toastr);
    }

    protected getReferenceNamesForRecordType(type: string): string[] {
        switch (type) {
            case 'IMAGE':
            case 'VIDEO':
            case 'ROUTE':
                return ['track_id_is', 'loc_lochirarchie_txt'];
            case 'TRACK':
                return ['route_id_is', 'loc_lochirarchie_txt', 'trip_id_is'];
            case 'LOCATION':
                return ['loc_lochirarchie_txt'];
            case 'POI':
                return ['loc_lochirarchie_txt'];
            case 'NEWS':
                return [];
            default:
                return undefined;
        }
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        if (facetName === 'loc_lochirarchie_txt') {
            keyValues.map(value => {
                value[1] = value[5];
            });
        }

        return super.generateSelectIdValues(facetName, keyValues);
    }
}
