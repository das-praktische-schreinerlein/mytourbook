import {ChangeDetectorRef, Input} from '@angular/core';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {ToastrService} from 'ngx-toastr';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {CommonDocAssignFormComponent, CommonDocAssignFormComponentResultType} from '../cdoc-assignform/cdoc-assignform.component';

export interface CommonDocReplaceFormComponentResultType extends CommonDocAssignFormComponentResultType {
    action: 'replace';
    ids: string[];
    newId: string;
    newIdSetNull: boolean;
}

export abstract class CommonDocReplaceFormComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> extends CommonDocAssignFormComponent<R, F, S, D> {
    @Input()
    public records: CommonDocRecord[];

    @Input()
    public resultObservable: Subject<CommonDocReplaceFormComponentResultType>;

    protected constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                          searchFormUtils: SearchFormUtils, cdocDataService: D, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, cdocDataService, toastr);
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

    protected abstract getReferenceNameForRecordType(type: string): string;

    protected abstract getSearchTypeForRecordType(type: string): string;

    protected getReferenceNamesForRecordType(type: string): string[] {
        const facetName = this.getReferenceNameForRecordType(type);
        return facetName !== undefined ? [facetName] : undefined;
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        const me = this;
        const recordTechNames = me.records.map(record =>
            me.generateComparatorName((<R>record).name));
        const values = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            keyValues, false, [], false);
        values.sort((a, b) => {
            const res = a.name.localeCompare(b.name);
            if (res === 0) {
                return a.id.toString().localeCompare(b.id.toString());
            }
            for (const recordTechName of recordTechNames) {
                if (me.generateComparatorName(a.name).localeCompare(recordTechName) === 0) {
                    return -1;
                }
            }
            for (const recordTechName of recordTechNames) {
                if (me.generateComparatorName(b.name).localeCompare(recordTechName) === 0) {
                    return 1;
                }
            }

            return res;
        });

        values.map(value => {
            value.name = value.name + ' - ID: ' + value.id;
        });

        return values;
    }

    protected generateComparatorName(name: string) {
        return name;
    }

    protected getCurrentReferenceField(): string {
        const rawValue = this.getReferenceNamesForRecordType(this.recordType);
        return Array.isArray(rawValue) ? rawValue[0] : undefined;
    }

}
