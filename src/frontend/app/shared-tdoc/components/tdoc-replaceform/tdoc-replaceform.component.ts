import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChange} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {ComponentUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/component.utils';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {ToastrService} from 'ngx-toastr';
import {TourDocAdapterResponseMapper} from '../../../../shared/tdoc-commons/services/tdoc-adapter-response.mapper';

export interface TourDocReplaceFormComponentResultType {
    action: 'replace';
    id: string;
    newId: string;
}

@Component({
    selector: 'app-tdoc-replaceform',
    templateUrl: './tdoc-replaceform.component.html',
    styleUrls: ['./tdoc-replaceform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocReplaceFormComponent extends AbstractInlineComponent {
    private lastRecord: TourDocRecord = undefined;

    public showLoadingSpinner = false;
    public replaceFormGroup: FormGroup = this.fb.group({
        newId: ''
    });
    public optionsSelectReplacement: IMultiSelectOption[] = [];
    public settingsSelectReplacement: IMultiSelectSettings =
        {dynamicTitleMaxItems: 1,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: false,
            autoUnselect: true,
            selectionLimit: 1};
    public textsSelectReplacement: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Objekt ausgewählt',
        checkedPlural: 'Objekt ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};

    @Input()
    public record: TourDocRecord;

    @Input()
    public resultObservable: Subject<TourDocReplaceFormComponentResultType>;

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                private searchFormUtils: SearchFormUtils, private tdocSearchFormUtils: TourDocSearchFormUtils,
                private tdocDataService: TourDocDataService, private toastr: ToastrService) {
        super(cd);
    }

    cancel(): boolean {
        this.activeModal.close('Cancel click');
        this.resultObservable.error('canceled');
        return false;
    }

    submitReplaceKey(event: Event): boolean {
        const values = this.replaceFormGroup.getRawValue();
        const newId = Array.isArray(values['newId']) ? values['newId'][0] : values['newId'];
        const me = this;

        this.resultObservable.next({
            action: 'replace',
            id: me.record.id,
            newId: newId});
        this.activeModal.close('Save click');

        return false;
    }

    public updateData(): void {
        const changes: {[propKey: string]: SimpleChange} = {};
        changes['record'] = new SimpleChange(this.record, this.lastRecord, false);
        if (this.record != null && !ComponentUtils.hasNgChanged(changes)) {
            return;
        }
        this.lastRecord = this.record;

        this.replaceFormGroup.patchValue({newId: '' });
        this.optionsSelectReplacement = [];
        if (this.record === undefined) {
            return;
        }

        this.updateSelectFields();
    }

    protected getFacetNameForRecord(record: TourDocRecord): string {
        switch (record.type) {
            case 'TRACK':
                return 'track_id_is';
            case 'ROUTE':
                return 'route_id_is';
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

    protected getSearchTypeForRecord(record: TourDocRecord): string {
        switch (record.type) {
            case 'TRACK':
                return 'ROUTE';
            case 'ROUTE':
                return 'TRACK';
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

    protected updateSelectFields() {
        const me = this;

        const facetName = this.getFacetNameForRecord(me.record);
        const searchType = this.getSearchTypeForRecord(me.record);
        if (facetName === undefined || searchType === undefined) {
            me.optionsSelectReplacement = [];
            me.cd.markForCheck();
            return;
        }

        me.showLoadingSpinner = true;
        me.cd.markForCheck();

        const searchForm: TourDocSearchForm = new TourDocSearchForm({type: searchType});
        this.tdocDataService.search(searchForm,
            {
                showFacets: [facetName],
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

            const keyValues = me.searchFormUtils.getFacetValues(tdocSearchResult, facetName, '', '');
            let values = [];
            if (facetName === 'loc_lochirarchie_txt') {
                const recordTechName = TourDocAdapterResponseMapper.generateDoubletteValue(me.record.techName);
                keyValues.sort((a, b) => {
                    const res = a[4].localeCompare(b[4]);
                    if (res === 0) {
                        return a[5].toString().localeCompare(b[5].toString());
                    }
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(a[1]).localeCompare(recordTechName) === 0) {
                        return -1;
                    }
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(b[1]).localeCompare(recordTechName) === 0) {
                        return 1;
                    }

                    return res;
                });
                keyValues.map(value => {
                    value[1] = value[5];
                });
                values = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    keyValues, false, [], false);
            } else {
                const recordTechName = TourDocAdapterResponseMapper.generateDoubletteValue(me.record.name);
                values = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                    keyValues, false, [], false);
                values.sort((a, b) => {
                    const res = a.name.localeCompare(b.name);
                    if (res === 0) {
                        return a.id.toString().localeCompare(b.id.toString());
                    }
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(a.name).localeCompare(recordTechName) === 0) {
                        return -1;
                    }
                    if (TourDocAdapterResponseMapper.generateDoubletteValue(b.name).localeCompare(recordTechName) === 0) {
                        return 1;
                    }

                    return res;
                });
            }

            values.map(value => {
                value.name = value.name + ' - ID: ' + value.id;
            });

            me.optionsSelectReplacement = values;
            me.cd.markForCheck();
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch failed:', reason);
            me.showLoadingSpinner = false;
            me.cd.markForCheck();
        });
    }
}
