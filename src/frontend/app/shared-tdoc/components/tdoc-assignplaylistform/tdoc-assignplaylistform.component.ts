import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {ActionTagEvent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {
    GenericCommonDocAssignFormComponent,
    GenericCommonDocAssignFormComponentResultType
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignform/generic-cdoc-assignform.component';

export interface TourDocAssignPlaylistFormComponentResultType extends GenericCommonDocAssignFormComponentResultType {
    action: 'assignplaylist' | string;
    playlistkey: string;
    position: number;
}

@Component({
    selector: 'app-tdoc-assignplaylistform',
    templateUrl: './tdoc-assignplaylistform.component.html',
    styleUrls: ['./tdoc-assignplaylistform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocAssignPlaylistFormComponent
    extends GenericCommonDocAssignFormComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService,
        TourDocAssignPlaylistFormComponentResultType> {

    @Input()
    public actionTagEvent: ActionTagEvent;

    protected facetNamePrefix = 'label.assignplaylist.reference.';
    protected position: number = undefined;

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, tdocDataService: TourDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, tdocDataService, toastr);
    }

    protected createResultObject(): TourDocAssignPlaylistFormComponentResultType {
        return {
            action: 'assignplaylist',
            ids: this.records.map(value => value.id),
            referenceField: this.getCurrentReferenceField(),
            newId: this.newId,
            playlistkey: this.newId,
            position: this.position
        }
    }

    protected createFormGroup(): FormGroup {
        return this.fb.group({
            referenceField: 'playlists_max_txt',
            newIdOption: 'select',
            newIdInput: '',
            position: '',
            newIdSelect: ''
        });
    }

    protected getReferenceNamesForRecordType(type: string): string[] {
        switch (type) {
            case 'IMAGE':
                return ['playlists_max_txt'];
            case 'VIDEO':
                return ['playlists_max_txt'];
            default:
                return undefined;
        }
    }

    protected onUpdateReferenceField(): boolean {
        return false;
    }

    protected onUpdateNewIdSelect(): boolean {
        this.checkFormAndSetValidFlag();

        return false;
    }

    public updateData(): void {
        this.position = undefined;
        super.updateData();
    }

    protected updateSelectFields() {
        this.assignFormGroup.patchValue({
            newIdOption: 'select',
            referenceField: 'playlists_max_txt'});

        super.updateSelectFields();
    }

    protected processFacetResults(searchForm: TourDocSearchForm, cdocSearchResult: TourDocSearchResult): void {
        super.processFacetResults(searchForm, cdocSearchResult);
        if (this.records !== undefined && this.records.length === 1) {
            this.assignFormGroup.patchValue({
                newIdOption: 'select',
                referenceField: 'playlists_max_txt',
                newIdSelect: this.actionTagEvent.config.payload['playlistkey'],
                position: this.actionTagEvent.config.payload['position'] });
        }
    }

    protected checkForm(): boolean {
        const values = this.assignFormGroup.getRawValue();
        this.newId = undefined;
        this.position = undefined;
        this.newId = Array.isArray(values['newIdSelect'])
            ? values['newIdSelect'][0]
            : values['newIdSelect'];
        this.position = Array.isArray(values['position'])
            ? values['position'][0]
            : values['position'];
        this.position = this.position === null || this.position <= 0
            ? undefined
            : this.position;

        if (this.newId === undefined || this.newId === null || this.newId === 'null' || this.newId === '') {
            return false;
        }

        return true;
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        const values = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            keyValues, true, [], false);

        values.map(value => {
            value.name = value.name + ' - ID: ' + value.id;
        });

        return values;
    }
}
