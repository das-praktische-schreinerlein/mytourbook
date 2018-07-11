import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {KeywordsState, CommonDocContentUtils, StructuredKeyword, StructuredKeywordState} from '../../services/cdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-tagsstate',
    templateUrl: './sdoc-tagsstate.component.html',
    styleUrls: ['./sdoc-tagsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocTagsStateComponent implements OnChanges {
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

    constructor(private contentUtils: CommonDocContentUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    doSetTag(keyword: string): void {
        this.setTag.emit(this.prefix + keyword);
    }

    doUnsetTag(keyword: string): void {
        this.unsetTag.emit(this.prefix + keyword);
    }

    private updateData() {
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
