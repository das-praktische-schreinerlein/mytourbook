import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {PDocAdapterResponseMapper} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-adapter-response.mapper';
import {
    CommonDocReplaceFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';

@Component({
    selector: 'app-pdoc-replaceform',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocReplaceFormComponent
    extends CommonDocReplaceFormComponent<PDocRecord, PDocSearchForm, PDocSearchResult, PDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, pdocDataService: PDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, pdocDataService, toastr);
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
            case 'PAGE':
                return 'page_id_is';
            default:
                return undefined;
        }

    }

    protected getSearchTypeForRecordType(type: string): string {
        switch (type) {
            case 'PAGE':
                return 'PAGE';
            default:
                return undefined;
        }
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        return super.generateSelectIdValues(facetName, keyValues);
    }

    protected generateComparatorName(name: string) {
        return PDocAdapterResponseMapper.generateDoubletteValue(name);
    }

}
