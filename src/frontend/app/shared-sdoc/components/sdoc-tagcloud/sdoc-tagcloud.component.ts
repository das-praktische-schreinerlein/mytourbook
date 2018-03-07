import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';

export interface TagcloudEntry {
    size: string;
    label: string;
    class: string;
    count: number;
}
@Component({
    selector: 'app-sdoc-tagcloud',
    templateUrl: './sdoc-tagcloud.component.html',
    styleUrls: ['./sdoc-tagcloud.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocTagcloudComponent implements OnChanges {
    columns: TagcloudEntry[] = [];

    @Input()
    public searchResult: SDocSearchResult;

    @Input()
    public facetName: string;

    @Input()
    public label?: string;

    @Input()
    public max? = 20;

    @Input()
    public valuePrefix? = '';

    @Input()
    public labelPrefix? = '';

    @Input()
    public sortKey? = 'label';

    @Output()
    public columnClicked: EventEmitter<string> = new EventEmitter();

    @Output()
    public columnsFound: EventEmitter<number> = new EventEmitter();

    minCount = 0;
    maxCount = 0;
    factor = 0;

    constructor(private searchParameterUtils: SearchParameterUtils, private searchFormUtils: SearchFormUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.render();
        }
    }

    onColumnClicked(key: any) {
        this.columnClicked.emit(this.valuePrefix + key);
        return false;
    }

    private render() {
        let result = [];
        const facetName = this.facetName;
        const origFacet = this.searchResult.facets;

        const values = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.searchParameterUtils.extractFacetValues(origFacet, facetName, '', this.labelPrefix),
            false, [], true);
        for (const value of values) {
            if (value['count'] <= 0) {
                continue;
            }

            const column = {
                count: parseInt(value['count'], 10),
                label: value.name,
                key: value.id
            };
            result.push(column);
        }

        if (result.length > 0) {
            // sort
            result.sort((a, b) => {
                const nameA = a['count'];
                const nameB = b['count'];
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            result = result.reverse();
            if (result.length > this.max) {
                result = result.slice(0, this.max);
            }
            this.maxCount = result[0]['count'];
            this.minCount = result[result.length - 1]['count'];
            this.factor = 100 / (this.maxCount - this.minCount) / 20;
            // sort
            result.sort((a, b) => {
                const numbers = !isNaN(parseFloat(a[this.sortKey])) && !isNaN(parseFloat(b[this.sortKey]));
                const nameA = numbers ? parseFloat(a[this.sortKey]) : a[this.sortKey];
                const nameB = numbers ? parseFloat(b[this.sortKey]) : b[this.sortKey];
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        }

        this.columns = result;

        this.columnsFound.emit(this.columns.length);
    }

    calcSizeClass(count: number): number {
        return Math.round((count - this.minCount) * this.factor);
    }
}
