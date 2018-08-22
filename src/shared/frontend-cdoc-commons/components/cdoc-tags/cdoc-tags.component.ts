import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {CommonDocContentUtils, StructuredKeyword} from '../../services/cdoc-contentutils.service';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

@Component({
    selector: 'app-cdoc-tags',
    templateUrl: './cdoc-tags.component.html',
    styleUrls: ['./cdoc-tags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDocTagsComponent extends AbstractInlineComponent{
    tagsKats: StructuredKeyword[] = [];

    @Input()
    public tags: string;

    @Input()
    public tagsConfig: StructuredKeyword[];

    @Input()
    public possiblePrefixes = [];

    @Input()
    public blacklist = [];

    constructor(private contentUtils: CommonDocContentUtils, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        this.tagsKats = [];
        if (this.tags === undefined) {
            return;
        }
        this.tagsKats = this.contentUtils.getStructuredKeywords(
            this.tagsConfig, this.tags.split(', '), this.blacklist, this.possiblePrefixes);
    }
}
