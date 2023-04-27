import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {CommonDocListComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list/cdoc-list.component';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {PDocSearchFormConverter} from '../../services/pdoc-searchform-converter.service';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Component({
    selector: 'app-pdoc-list',
    templateUrl: './pdoc-list.component.html',
    styleUrls: ['./pdoc-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocListComponent extends CommonDocListComponent<PDocRecord, PDocSearchForm, PDocSearchResult> {
    public Layout = Layout;

    constructor(private searchFormConverter: PDocSearchFormConverter, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    getBackToSearchUrl(searchResult: PDocSearchResult): string {
        return (searchResult.searchForm ?
            this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchResult.searchForm) : undefined);
    }

    protected updateData(): void {
    }
}
