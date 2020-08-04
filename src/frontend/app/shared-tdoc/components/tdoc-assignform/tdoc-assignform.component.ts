import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocAssignFormComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-tdoc-assignform',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/cdoc-assignform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocAssignFormComponent
    extends CommonDocAssignFormComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, tdocDataService: TourDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, tdocDataService, toastr);
    }

    protected getReferenceNamesForRecordType(type: string): string[] {
        switch (type) {
            case 'IMAGE':
            case 'VIDEO':
                return ['track_id_is', 'loc_lochirarchie_txt'];
            case 'TRACK':
                return ['route_id_is', 'loc_lochirarchie_txt', 'trip_id_is'];
            case 'ROUTE':
                return ['track_id_is', 'loc_lochirarchie_txt'];
            case 'LOCATION':
                return ['loc_lochirarchie_txt'];
            case 'TRIP':
                return ['loc_lochirarchie_txt'];
            case 'NEWS':
                return ['loc_lochirarchie_txt'];
            case 'INFO':
                return ['loc_lochirarchie_txt'];
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
