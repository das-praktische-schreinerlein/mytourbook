import {ChangeDetectorRef, Input, OnInit, SimpleChange} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {ComponentUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/component.utils';
import {ToastrService} from 'ngx-toastr';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {ActionTagFormResultType} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

export interface CommonDocKeywordTagFormComponentResultType extends ActionTagFormResultType {
    action: 'keyword' | string;
    ids: string[];
    keywords: string;
    keywordAction: string;
}

export interface CommonDocKeywordTagFormComponentConfig {
    editPrefix;
}

export abstract class CommonDocKeywordTagFormComponent<R extends CommonDocRecord> extends AbstractInlineComponent implements OnInit {
    private lastRecords: CommonDocRecord[] = undefined;

    protected config: {};
    editPrefix = '';
    keywordSuggestions: string[] = [];
    public validForSubmit = false;
    public showLoadingSpinner = false;
    public keywordFormGroup: FormGroup = this.fb.group({
        keywords: ''
    });

    @Input()
    public records: CommonDocRecord[];

    @Input()
    public resultObservable: Subject<CommonDocKeywordTagFormComponentResultType>;

    protected constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
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

    onSubmitKeywordKey(set: boolean): boolean {
        if (!this.checkFormAndSetValidFlag()) {
            return false;
        }

        const me = this;
        const event: any = {
            action: 'keyword',
            ids: me.records.map(value => value.id),
            keywords: this.keywordFormGroup.getRawValue()['keywords'],
            keywordAction: set ? 'set' : 'unset'
        };
        this.resultObservable.next(event);
        this.activeModal.close('Save click');

        return false;
    }

    setKeyword(keyword: string): void {
        let keywords = this.keywordFormGroup.getRawValue()['keywords'];
        if (keywords && keywords.length > 0) {
            keywords = keywords + ', ' + keyword;
        } else {
            keywords = keyword;
        }

        this.keywordFormGroup.patchValue({ keywords: keywords});
        this.checkFormAndSetValidFlag();
    }

    unsetKeyword(keyword: string): void {
        let keywords = this.keywordFormGroup.getRawValue()['keywords'];
        if (keywords.length > 0) {
            keywords = keywords.replace(new RegExp(' ' + keyword + ','), '')
                .replace(new RegExp('^' + keyword + ', '), '')
                .replace(new RegExp(', ' + keyword + '$'), '')
                .replace(new RegExp('^' + keyword + '$'), '');
        }

        this.keywordFormGroup.patchValue({ keywords: keywords});
        this.checkFormAndSetValidFlag();
    }

    public updateData(): void {
        const changes: { [propKey: string]: SimpleChange } = {};
        changes['records'] = new SimpleChange(this.records, this.lastRecords, false);
        if (this.records != null && !ComponentUtils.hasNgChanged(changes)) {
            return;
        }
        this.lastRecords = this.records;
        this.validForSubmit = false;
        this.keywordFormGroup.patchValue({keywords: ''});
        this.updateKeywordSuggestions();
        this.checkFormAndSetValidFlag();
    }

    protected getComponentConfig(config: {}): CommonDocKeywordTagFormComponentConfig {
        let prefix = '';
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.editPrefix')) {
            prefix = BeanUtils.getValue(config, 'components.cdoc-keywords.editPrefix');
        }

        return {
            editPrefix: prefix
        };
    }

    protected updateKeywordSuggestions(): boolean {
        let suggestions = [];
        for (const record of this.records) {
            if (record.keywords !== undefined) {
                suggestions = suggestions.concat(record.keywords.replace(/ /g, '').split(','));
            }
        }
        this.keywordSuggestions = suggestions;

        return true;
    }

    protected checkForm(): boolean {
        if (this.keywordFormGroup.getRawValue()['keywords'].length > 0) {
            return true;
        }

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

}
