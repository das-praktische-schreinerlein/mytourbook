import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {ComponentUtils} from '../../../angular-commons/services/component.utils';
import {CommonDocContentUtils, StructuredKeyword} from '../../services/cdoc-contentutils.service';

@Component({
    selector: 'app-cdoc-tags',
    templateUrl: './cdoc-tags.component.html',
    styleUrls: ['./cdoc-tags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocTagsComponent implements OnChanges {
    tagsKats: StructuredKeyword[] = [];

    @Input()
    public tags: string;

    @Input()
    public tagsConfig: StructuredKeyword[];

    @Input()
    public possiblePrefixes = [];

    @Input()
    public blacklist = [];

    constructor(private contentUtils: CommonDocContentUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        this.tagsKats = [];
        if (this.tags === undefined) {
            return;
        }
        this.tagsKats = this.contentUtils.getStructuredKeywords(
            this.tagsConfig, this.tags.split(', '), this.blacklist, this.possiblePrefixes);
    }
}
