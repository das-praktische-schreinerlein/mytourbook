import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {TourDocAdapterResponseMapper} from '../../../../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {
    CommonDocReplaceFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';

@Component({
    selector: 'app-tdoc-replaceform',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocReplaceFormComponent
    extends CommonDocReplaceFormComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, tdocDataService: TourDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, tdocDataService, toastr);
    }

    onCancel(): boolean {
        this.resultObservable.error('canceled');
        this.activeModal.close('Cancel click');
        return false;
    }

    onSubmitAssignKey(): boolean {
        if (!this.checkFormAndSetValidFlag()) {
            return false;
        }

        const me = this;
        this.resultObservable.next({
            action: 'replace',
            ids: me.records.map(value => value.id),
            referenceField: this.getCurrentReferenceField(),
            newId: this.newId,
            newIdSetNull: this.newIdNullFlag});
        this.activeModal.close('Save click');

        return false;
    }

    protected getReferenceNameForRecordType(type: string): string {
        switch (type) {
            case 'IMAGE':
                return 'image_id_is';
            case 'VIDEO':
                return 'video_id_is';
            case 'TRACK':
                return 'track_id_is';
            case 'ROUTE':
                return 'route_id_is';
            case 'INFO':
                return 'info_id_is';
            case 'LOCATION':
                return 'loc_lochirarchie_txt';
            case 'TRIP':
                return 'trip_id_is';
            case 'NEWS':
                return 'news_id_is';
            default:
                return undefined;
        }

    }

    protected getSearchTypeForRecordType(type: string): string {
        switch (type) {
            case 'TRACK':
                return 'ROUTE';
            case 'ROUTE':
                return 'TRACK';
            case 'INFO':
                return 'ROUTE';
            case 'LOCATION':
                return 'TRACK';
            case 'TRIP':
                return 'TRACK';
            case 'NEWS':
                return 'TRACK';
            default:
                return undefined;
        }
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        if (facetName === 'loc_lochirarchie_txt') {
            const me = this;
            const recordTechNames = me.records.map(record =>
                TourDocAdapterResponseMapper.generateDoubletteValue((<TourDocRecord>record).techName));
            keyValues.sort((a, b) => {
                if (a[4] === undefined && b[4] !== undefined) {
                    return -1;
                } else if (a[4] !== undefined && b[4] === undefined) {
                    return 1;
                }

                let res = 0;
                if (a[4] !== undefined && b[4] !== undefined) {
                    res = a[4].localeCompare(b[4])
                }
                if (res === 0) {
                    return a[5].toString().localeCompare(b[5].toString());
                }

                for (const recordTechName of recordTechNames) {
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(a[1]).localeCompare(recordTechName) === 0) {
                        return -1;
                    }
                }
                for (const recordTechName of recordTechNames) {
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(b[1]).localeCompare(recordTechName) === 0) {
                        return 1;
                    }
                }

                return res;
            });
            keyValues.map(value => {
                value[1] = value[5];
            });
            const values = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                keyValues, false, [], false);
            values.map(value => {
                value.name = value.name + ' - ID: ' + value.id;
            });

            return values;
        }

        return super.generateSelectIdValues(facetName, keyValues);
    }

    protected generateComparatorName(name: string) {
        return TourDocAdapterResponseMapper.generateDoubletteValue(name);
    }

}
