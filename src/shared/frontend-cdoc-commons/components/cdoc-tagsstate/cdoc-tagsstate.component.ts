import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonDocContentUtils, KeywordsState, StructuredKeyword, StructuredKeywordState} from '../../services/cdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

@Component({
    selector: 'app-cdoc-tagsstate',
    templateUrl: './cdoc-tagsstate.component.html',
    styleUrls: ['./cdoc-tagsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDocTagsStateComponent extends AbstractInlineComponent {
    tagsKats: StructuredKeywordState[] = [];
    public KeywordState = KeywordsState;

    @Input()
    public tags: string;

    @Input()
    public suggestions?: string[] = [];

    @Input()
    public tagsConfig: StructuredKeyword[];

    @Input()
    public possiblePrefixes = [];

    @Input()
    public prefix = '';

    @Output()
    public unsetTag: EventEmitter<string> = new EventEmitter();

    @Output()
    public setTag: EventEmitter<string> = new EventEmitter();

    @Output()
    public tagsFound: EventEmitter<StructuredKeywordState[]> = new EventEmitter();

    constructor(private contentUtils: CommonDocContentUtils, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    doSetTag(keyword: string): void {
        this.setTag.emit(this.prefix + keyword);
    }

    doUnsetTag(keyword: string): void {
        this.unsetTag.emit(this.prefix + keyword);
    }

    protected updateData(): void {
        this.tagsKats = [];
        if (this.tags === undefined || this.tags === null) {
            this.tagsFound.emit([]);
            return;
        }

        this.tagsKats = this.contentUtils.getStructuredKeywordsState(
            this.tagsConfig,
            this.tags.split(', '),
            this.suggestions ? this.suggestions : [],
            this.possiblePrefixes);
        this.tagsFound.emit(this.tagsKats);
    }
}
