import {ChangeDetectorRef, Input, SimpleChange} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {ComponentUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/component.utils';
import {ToastrService} from 'ngx-toastr';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {ActionTagFormResultType} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {
    CommonDocContentUtils,
    KeywordSuggestion
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

export interface CommonDocKeywordTagFormComponentResultType extends ActionTagFormResultType {
    action: 'keyword' | string;
    ids: string[];
    keywords: string;
    set: boolean;
}

export interface CommonDocKeywordTagFormComponentConfig {
    inputSuggestionValueConfig: {};
    suggestionConfigs: KeywordSuggestion[];
    editPrefix;
}

export abstract class CommonDocKeywordTagFormComponent<R extends CommonDocRecord> extends AbstractInlineComponent {
    private lastRecords: CommonDocRecord[] = undefined;

    protected config: {};
    suggestionConfigs: KeywordSuggestion[] = [];
    editPrefix = '';
    keywordSuggestions: string[] = [];
    protected inputSuggestionValueConfig = {};
    public inputSuggestionValues = {};
    public validForSubmit = false;
    public showLoadingSpinner = false;
    public keywordFormGroup: FormGroup = this.fb.group({
        keywords: '',
        set: true
    });

    @Input()
    public records: CommonDocRecord[];

    @Input()
    public resultObservable: Subject<CommonDocKeywordTagFormComponentResultType>;

    protected constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                          protected contentUtils: CommonDocContentUtils, protected toastr: ToastrService) {
        super(cd);
    }

    onCancel(): boolean {
        this.activeModal.close('Cancel click');
        this.resultObservable.error('canceled');

        return false;
    }

    onSubmitKeywordKey(): boolean {
        if (!this.checkFormAndSetValidFlag()) {
            return false;
        }

        const me = this;
        this.resultObservable.next({
            action: 'keyword',
            ids: me.records.map(value => value.id),
            keywords: this.keywordFormGroup.getRawValue()['keywords'],
            set: true
        });
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
        this.keywordFormGroup.patchValue({referenceField: '', newIdOption: 'input', newIdInput: '', newIdSelect: ''});
    }

    protected getComponentConfig(config: {}): CommonDocKeywordTagFormComponentConfig {
        let prefix = '';
        let suggestionConfig = [];
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.keywordSuggestions')) {
            suggestionConfig = BeanUtils.getValue(config, 'components.cdoc-keywords.keywordSuggestions');
            prefix = BeanUtils.getValue(config, 'components.cdoc-keywords.editPrefix');
        }

        return {
            suggestionConfigs: suggestionConfig,
            editPrefix: prefix,
            inputSuggestionValueConfig: {
            }
        };
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.suggestionConfigs = componentConfig.suggestionConfigs;
        this.editPrefix = componentConfig.editPrefix;
        this.inputSuggestionValueConfig = componentConfig.inputSuggestionValueConfig;
    }

    protected updateKeywordSuggestions(): boolean {
        if (this.suggestionConfigs.length > 0) {
            this.keywordSuggestions = this.contentUtils.getSuggestedKeywords(this.suggestionConfigs, this.editPrefix,
                this.keywordFormGroup.getRawValue());
            this.cd.markForCheck();
        } else {
            console.warn('no valid keywordSuggestions found');
            this.keywordSuggestions = [];
        }

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
