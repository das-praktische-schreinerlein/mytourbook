import {ChangeDetectorRef, Input, OnInit, SimpleChange} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {ComponentUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/component.utils';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {ToastrService} from 'ngx-toastr';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {ActionTagFormResultType} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';

export interface CommonDocAssignFormComponentResultType extends ActionTagFormResultType {
    action: 'assign' | string;
    ids: string[];
    referenceField: string;
    newId: string;
    newIdSetNull: boolean;
}

export abstract class CommonDocAssignFormComponent<R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> extends AbstractInlineComponent implements OnInit {
    private lastRecords: CommonDocRecord[] = undefined;
    private facetValues = {};
    protected newId: string = undefined;
    protected newIdNullFlag: boolean = undefined;

    public validForSubmit = false;
    public recordType: string = undefined;
    public showLoadingSpinner = false;
    public assignFormGroup: FormGroup = this.fb.group({
        referenceField: '',
        newIdOption: 'id',
        newIdInput: '',
        newIdSelect: ''
    });
    public optionsSelectNewId: IMultiSelectOption[] = [];
    public settingsSelectNewId: IMultiSelectSettings =
        {
            dynamicTitleMaxItems: 1,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: false,
            autoUnselect: true,
            selectionLimit: 1
        };
    public textsSelectNewId: IMultiSelectTexts = {
        checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Id ausgewählt',
        checkedPlural: 'Id ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'
    };
    public optionsSelectReferenceField: IMultiSelectOption[] = [];
    public settingsSelectReferenceField: IMultiSelectSettings =
        {
            dynamicTitleMaxItems: 1,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: false,
            autoUnselect: true,
            selectionLimit: 1
        };
    public textsSelectReferenceField: IMultiSelectTexts = {
        checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Feld ausgewählt',
        checkedPlural: 'Feld ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'
    };

    @Input()
    public records: CommonDocRecord[];

    @Input()
    public resultObservable: Subject<CommonDocAssignFormComponentResultType>;

    protected constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                protected searchFormUtils: SearchFormUtils, protected cdocDataService: D,
                protected toastr: ToastrService) {
        super(cd);
    }

    ngOnInit() {
        this.updateData();
    }

    onCancel(): boolean {
        this.activeModal.close('Cancel click');
        this.resultObservable.error('canceled');

        return false;
    }

    onSubmitAssignKey(): boolean {
        if (!this.checkFormAndSetValidFlag()) {
            return false;
        }

        const me = this;
        this.resultObservable.next({
            action: 'assign',
            ids: me.records.map(value => value.id),
            referenceField: this.getCurrentReferenceField(),
            newId: this.newId,
            newIdSetNull: this.newIdNullFlag
        });
        this.activeModal.close('Save click');

        return false;
    }

    public updateData(): void {
        const changes: { [propKey: string]: SimpleChange } = {};
        changes['records'] = new SimpleChange(this.records, this.lastRecords, false);
        if (this.records != null && !ComponentUtils.hasNgChanged(changes)) {
            return;
        }
        this.lastRecords = this.records;
        this.newId = undefined;
        this.newIdNullFlag = false;
        this.validForSubmit = false;

        this.assignFormGroup.patchValue({referenceField: '', newIdOption: 'input', newIdInput: '', newIdSelect: ''});
        this.optionsSelectReferenceField = [];
        this.optionsSelectNewId = [];

        this.updateSelectFields();
    }

    protected checkForm(): boolean {
        const values = this.assignFormGroup.getRawValue();
        const newIdOption = Array.isArray(values['newIdOption']) ? values['newIdOption'][0] : values['newIdOption'];
        this.newId = undefined;
        this.newIdNullFlag = false;
        switch (newIdOption) {
            case 'null':
                this.newId = null;
                this.newIdNullFlag = true;
                break;
            case 'input':
                this.newId = Array.isArray(values['newIdInput']) ? values['newIdInput'][0] : values['newIdInput'];
                break;
            case 'select':
                this.newId = Array.isArray(values['newIdSelect']) ? values['newIdSelect'][0] : values['newIdSelect'];
                break;
            default:
                return false;
        }
        if (this.newIdNullFlag === true) {
            if (this.newId !== null) {
                return false;
            }
        } else {
            if (this.newId === undefined || this.newId === null || this.newId === 'null' || this.newId === '') {
                return false;
            }
        }

        if (this.getCurrentReferenceField() === undefined || this.getCurrentReferenceField() === null
            || this.getCurrentReferenceField().length < 1) {
            return false;
        }

        return true;
    }

    protected onUpdateReferenceField(): boolean {
        this.optionsSelectNewId = this.facetValues[this.getCurrentReferenceField()] || [];
        this.assignFormGroup.patchValue({newIdSelect: ''});
        this.checkFormAndSetValidFlag();

        return false;
    }

    protected onUpdateNewIdSelect(): boolean {
        this.assignFormGroup.patchValue({newIdOption: 'select'});
        this.checkFormAndSetValidFlag();

        return false;
    }

    protected checkFormAndSetValidFlag(event?: any): boolean {
        if (this.checkForm()) {
            this.validForSubmit = true;
            this.cd.markForCheck();
            return true;
        } else {
            this.validForSubmit = false;
            this.cd.markForCheck();
            return false;
        }
    }

    protected abstract getReferenceNamesForRecordType(type: string): string[];

    protected getSearchTypeForRecordType(type: string): string {
        return type;
    }

    protected updateSelectFields() {
        const me = this;
        let searchType = undefined;
        if (me.records === undefined) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            me.optionsSelectReferenceField = [];
            me.optionsSelectNewId = [];
            me.recordType = 'UNKNOWN';
            me.checkFormAndSetValidFlag();
            return;
        }

        for (const record of me.records) {
            if (me.recordType !== undefined && record.type !== me.recordType) {
                me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
                me.optionsSelectReferenceField = [];
                me.optionsSelectNewId = [];
                me.recordType = 'UNKNOWN';
                me.checkFormAndSetValidFlag();
                return;
            }

            me.recordType = record.type;
            searchType = me.getSearchTypeForRecordType(record.type);
        }

        const facetNames = me.getReferenceNamesForRecordType(me.recordType);
        if (facetNames === undefined || facetNames.length < 1) {
            me.optionsSelectReferenceField = [];
            me.optionsSelectNewId = [];
            me.checkFormAndSetValidFlag();
            return;
        }

        const facetValues: any[][] = [];
        for (const facetName of facetNames) {
            facetValues.push(
                ['label.assign.reference.', facetName, '', facetName]
            );
        }

        me.optionsSelectReferenceField = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            facetValues, false, [], true);
        me.optionsSelectNewId = [];
        me.facetValues = {};
        me.assignFormGroup.patchValue({newIdSelect: ''});

        if (searchType === undefined) {
            me.checkFormAndSetValidFlag();
            return;
        }

        me.showLoadingSpinner = true;
        me.checkFormAndSetValidFlag();

        const searchForm: F = me.cdocDataService.createDefaultSearchForm();
        searchForm.type = searchType;
        me.cdocDataService.search(searchForm,
            {
                showFacets: facetNames,
                loadTrack: false,
                showForm: false
            }).then(function doneSearch(cdocSearchResult) {
            me.showLoadingSpinner = false;

            if (cdocSearchResult === undefined) {
                console.log('empty searchResult', cdocSearchResult);
                cdocSearchResult = me.cdocDataService.newSearchResult(searchForm, 0, [], new Facets());
            } else {
                console.log('update searchResult', cdocSearchResult);
            }

            me.facetValues = {};
            me.assignFormGroup.patchValue({newIdSelect: ''});
            for (const facetName of facetNames) {
                const keyValues = me.searchFormUtils.getFacetValues(cdocSearchResult, facetName, '', '');
                me.facetValues[facetName] = me.generateSelectIdValues(facetName, keyValues);
            }

            me.optionsSelectNewId = me.facetValues[me.getCurrentReferenceField()] || [];
            me.showLoadingSpinner = false;
            me.checkFormAndSetValidFlag();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.optionsSelectNewId = [];
            me.facetValues = {};
            me.assignFormGroup.patchValue({newIdSelect: ''});
            me.checkFormAndSetValidFlag();
        });
    }

    protected getCurrentReferenceField(): string {
        const rawValue = this.assignFormGroup.getRawValue();
        return Array.isArray(rawValue['referenceField']) ? rawValue['referenceField'][0] : rawValue['referenceField'];
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        const values = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            keyValues, false, [], false);

        values.map(value => {
            value.name = value.name + ' - ID: ' + value.id;
        });

        return values;
    }
}
