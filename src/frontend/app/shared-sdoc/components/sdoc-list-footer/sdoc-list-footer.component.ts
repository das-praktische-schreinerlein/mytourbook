import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';

@Component({
    selector: 'app-sdoc-list-footer',
    templateUrl: './sdoc-list-footer.component.html',
    styleUrls: ['./sdoc-list-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListFooterComponent {

    @Input()
    public searchResult: SDocSearchResult;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter();

    constructor() {
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }
}
