import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-sdoc-searchform',
    templateUrl: './sdoc-searchform.component.html',
    styleUrls: ['./sdoc-searchform.component.css']
})
export class SDocSearchformComponent implements OnInit {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private _searchForm = new BehaviorSubject<SDocSearchForm>(new SDocSearchForm({}));

    @Input()
    public set searchForm(value: SDocSearchForm) {
        // set the latest value for _data BehaviorSubject
        this._searchForm.next(value);
    };

    public get searchForm(): SDocSearchForm {
        // get the latest value from _data BehaviorSubject
        return this._searchForm.getValue();
    }
    @Output()
    search: EventEmitter<SDocSearchForm> = new EventEmitter();

    // empty default
    searchFormGroup = this.fb.group({
        when: '',
        where: '',
        what: '',
        fulltext: '',
        sort: '',
        perPage: 10,
        pageNum: 1
    });

    constructor(public fb: FormBuilder) {
    }

    ngOnInit() {
        this._searchForm.subscribe(
            sdocSearchForm => {
                const values: SDocSearchForm = sdocSearchForm;
                this.searchFormGroup = this.fb.group({
                    fulltext: values.fulltext
                });
            },
        );
    }

    submitSearch() {
        this.search.emit(this.searchFormGroup.getRawValue());
    }
}
