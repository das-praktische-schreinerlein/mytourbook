import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SimpleChange} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {ComponentUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/component.utils';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {ToastrService} from 'ngx-toastr';
import {ObjectDetectionState} from '@dps/mycms-commons/dist/commons/model/objectdetection-model';
import {ActionTagFormResultType} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';

export interface TourDocObjectDetectionObjectKeyEditFormResultType extends ActionTagFormResultType {
    action: 'changeObjectKeyForRecord' | 'changeObjectLabelForObjectKey'| 'createObjectLabelForObjectKey' | 'createNewObjectKeyAndObjectLabel';
    detector: string;
    state: ObjectDetectionState;
    objectkey: string;
    objectname: string;
    objectcategory: string;
}

@Component({
    selector: 'app-tdoc-odobjectkeyeditform',
    templateUrl: './tdoc-odobjectkeyeditform.component.html',
    styleUrls: ['./tdoc-odobjectkeyeditform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocObjectDetectionObjectKeyEditFormComponent extends AbstractInlineComponent implements OnInit {
    private lastRecord: TourDocRecord = undefined;
    private existingObjectKeys = {};
    private existingObjectNames = {};
    private existingObjectTypes = {};

    public showLoadingSpinner = false;
    public changeObjectKeyForRecordFormGroup: FormGroup = this.fb.group({
        objectkey: ''
    });
    public changeObjectLabelForObjectKeyFormGroup: FormGroup = this.fb.group({
        objectkey: '',
        objectname: ''
    });
    public createObjectLabelForObjectKeyFormGroup: FormGroup = this.fb.group({
        objectkey: '',
        objectname: '',
        objectcategory: '',
        objectnameselect: '',
        objectcategoryselect: '',
        objectaction: ''
    });
    public optionsSelectObjectDetectionKey: IMultiSelectOption[] = [];
    public settingsSelectObjectDetectionKey: IMultiSelectSettings =
        {dynamicTitleMaxItems: 1,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: false,
            autoUnselect: true,
            selectionLimit: 1};
    public textsSelectObjectDetectionKey: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Objekt ausgewählt',
        checkedPlural: 'Objekt ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public optionsSelectObjectDetectionName: IMultiSelectOption[] = [];
    public settingsSelectObjectDetectionName = this.settingsSelectObjectDetectionKey;
    public textsSelectObjectDetectionName = this.textsSelectObjectDetectionKey;
    public optionsSelectObjectDetectionCategory: IMultiSelectOption[] = [];
    public settingsSelectObjectDetectionCategory = this.settingsSelectObjectDetectionKey;
    public textsSelectObjectDetectionCategory = this.textsSelectObjectDetectionKey;

    @Input()
    public record: TourDocRecord;

    @Input()
    public resultObservable: Subject<TourDocObjectDetectionObjectKeyEditFormResultType>;

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                private searchFormUtils: SearchFormUtils, private tdocSearchFormUtils: TourDocSearchFormUtils,
                private tdocDataService: TourDocDataService, private toastr: ToastrService) {
        super(cd);
    }

    ngOnInit() {
        this.updateData();
    }

    cancel(): boolean {
        this.activeModal.close('Cancel click');
        this.resultObservable.error('canceled');
        return false;
    }

    submitChangeObjectKeyForRecord(event: Event): boolean {
        return this.submitCommonForm('changeObjectKeyForRecord', this.changeObjectKeyForRecordFormGroup);
    }

    submitChangeObjectLabelForObjectKey(event: Event): boolean {
        return this.submitCommonForm('changeObjectLabelForObjectKey', this.changeObjectLabelForObjectKeyFormGroup);
    }

    submitCreateObjectLabelForObjectKey(event: Event): boolean {
        return this.submitCommonForm(
            this.createObjectLabelForObjectKeyFormGroup.getRawValue()['objectaction'], this.createObjectLabelForObjectKeyFormGroup);
    }

    updateFormCreateObjectLabelForObjectKey(event: Event, field: string): boolean {
        const values = this.createObjectLabelForObjectKeyFormGroup.getRawValue()[field];
        const value = Array.isArray(values)
            ? (values.length > 0 ? values[0] : undefined)
            : values;
        switch (field) {
            case 'objectnameselect':
                if (value) {
                    this.createObjectLabelForObjectKeyFormGroup.patchValue({objectname: value});
                }
                return;
            case 'objectcategoryselect':
                if (value) {
                    this.createObjectLabelForObjectKeyFormGroup.patchValue({objectcategory: value});
                }
                return;
        }
    }

    public updateData(): void {
        const changes: {[propKey: string]: SimpleChange} = {};
        changes['record'] = new SimpleChange(this.record, this.lastRecord, false);
        if (this.record != null && !ComponentUtils.hasNgChanged(changes)) {
            return;
        }
        this.lastRecord = this.record;

        this.changeObjectKeyForRecordFormGroup.patchValue({objectkey: '' });
        this.changeObjectLabelForObjectKeyFormGroup.patchValue({objectkey: '', objectname: ''});
        this.createObjectLabelForObjectKeyFormGroup.patchValue({objectkey: '', objectname: '', objectcategory: '',
            objectaction: 'createObjectLabelForObjectKey'  });
        this.optionsSelectObjectDetectionKey = [];
        if (this.record === undefined) {
            return;
        }

        this.updateSearchForm();
        this.updateSelectFields();
    }

    protected updateSearchForm() {
        if (this.record['tdocodimageobjects'] && this.record['tdocodimageobjects'].length > 0) {
            this.changeObjectKeyForRecordFormGroup.patchValue({objectkey: this.record['tdocodimageobjects'][0]['key'] });
            this.changeObjectLabelForObjectKeyFormGroup.patchValue({
                objectkey: this.record['tdocodimageobjects'][0]['key'],
                objectname: this.record['tdocodimageobjects'][0]['name']});
            this.createObjectLabelForObjectKeyFormGroup.patchValue({
                objectkey: this.record['tdocodimageobjects'][0]['key'],
                objectname: this.record['tdocodimageobjects'][0]['name'],
                objectcategory: this.record['tdocodimageobjects'][0]['category'],
                objectnameselect: '',
                objectcategoryselect: ''
            });
        }
    }

    protected updateSelectFields() {
        const me = this;
        me.existingObjectKeys = {};
        me.existingObjectNames = {};
        me.existingObjectTypes = {};
        me.showLoadingSpinner = true;
        me.cd.markForCheck();
        const searchForm: TourDocSearchForm = new TourDocSearchForm({
            objectDetectionDetector: this.record['tdocodimageobjects'][0]['detector'],
            type: 'odimgobject'});

        this.tdocDataService.search(searchForm,
            {
                showFacets: ['odkeys_all_txt', 'odcategory_all_txt'],
                loadTrack: false,
                showForm: false
            }).then(function doneSearch(tdocSearchResult) {
            me.showLoadingSpinner = false;

            if (tdocSearchResult === undefined) {
                // console.log('empty searchResult', cdocSearchResult);
                tdocSearchResult = me.tdocDataService.newSearchResult(searchForm, 0, [], new Facets());
            } else {
                // console.log('update searchResult', cdocSearchResult);
            }

            const keyValues = me.searchFormUtils.getFacetValues(tdocSearchResult, 'odkeys_all_txt', '', '');
            me.optionsSelectObjectDetectionKey = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                keyValues, true, [], false);
            me.optionsSelectObjectDetectionName = [];
            me.optionsSelectObjectDetectionCategory = [];
            keyValues.map(function (value) {
                let name: string = value[1];
                let category = 'Default';
                if (value.length >= 5 && value[4] !== undefined) {
                    const parts = value[4].split(' | ');
                    name = parts[0];
                    if (parts.length > 2) {
                        category = parts[1];
                    }
                }
                const label = value[0] + name;
                me.existingObjectKeys[value[1]] = value[1];

                if (me.existingObjectNames[name] === undefined) {
                    me.existingObjectNames[name] = name;
                    me.optionsSelectObjectDetectionName.push({id: name, name: label});
                }
                if (me.existingObjectTypes[category] === undefined) {
                    me.existingObjectTypes[category] = category;
                    me.optionsSelectObjectDetectionCategory.push({id: category, name: category});
                }
            });

            me.cd.markForCheck();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }

    protected submitCommonForm(action: 'changeObjectKeyForRecord' | 'changeObjectLabelForObjectKey' | 'createObjectLabelForObjectKey'
        | 'createNewObjectKeyAndObjectLabel', formGroup: FormGroup): boolean {
        const values = formGroup.getRawValue();
        const objectkey = Array.isArray(values['objectkey']) ? values['objectkey'][0] : values['objectkey'];
        const objectname = Array.isArray(values['objectname']) ? values['objectname'][0] : values['objectname'];
        const objectcategory = Array.isArray(values['objectcategory']) ? values['objectcategory'][0] : values['objectcategory'];

        switch (action) {
            case 'changeObjectKeyForRecord':
                if (this.existingObjectKeys[objectkey] === undefined) {
                    return false;
                }
                break;
            case 'changeObjectLabelForObjectKey':
                if (this.existingObjectKeys[objectkey] === undefined) {
                    return false;
                }
                if (this.existingObjectNames[objectname] === undefined) {
                    return false;
                }
                break;
            case 'createObjectLabelForObjectKey':
                if (this.existingObjectKeys[objectkey] === undefined) {
                    return false;
                }
                if (this.existingObjectNames[objectname] !== undefined) {
                    return false;
                }
                break;
            case 'createNewObjectKeyAndObjectLabel':
                break;
            default:
                return false;
        }

        let state = ObjectDetectionState.RUNNING_MANUAL_CORRECTED;
        if (this.record['tdocodimageobjects'][0]['state'] === ObjectDetectionState.RUNNING_MANUAL_DETAIL_NEEDED) {
            state = ObjectDetectionState.RUNNING_MANUAL_DETAILED;
        }

        this.resultObservable.next({
            action: action,
            detector: this.record['tdocodimageobjects'][0]['detector'],
            state: state,
            objectkey: objectkey,
            objectname: objectname,
            objectcategory: objectcategory});
        this.activeModal.close('Save click');

        return false;
    }

}
