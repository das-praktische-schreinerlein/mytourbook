import {Injectable} from '@angular/core';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {
    CommonDocListSuggesterConfiguration,
    CommonDocListSuggesterEnvironment,
    CommonDocListSuggesterService
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-list-suggester.service';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Injectable()
export class PDocPageDescSuggesterService
    extends CommonDocListSuggesterService<PDocRecord, PDocSearchForm, PDocSearchResult> {

    constructor(protected pDocDataService: PDocDataService, protected appService: GenericAppService) {
        super(pDocDataService);
    }

    protected appendFiltersToListItemSearchForm(searchForm: PDocSearchForm, form: {}, environment: CommonDocListSuggesterEnvironment) {
        searchForm.sort = 'ratePers';
        searchForm.perPage = 20;
        searchForm.type = 'PAGE';
    }

    protected getConfiguration(environment: CommonDocListSuggesterEnvironment): CommonDocListSuggesterConfiguration {
        return BeanUtils.getValue(this.appService.getAppConfig(), 'components.pdoc-page-desc-suggester') ||  {
            nameReplacements: this.DEFAULT_NAME_REPLACEMENTS,
            listItemTemplate: '- [{{LISTITEM.name}}](pdoc/show/page/{{LISTITEM.id}})\n',
            listItemsFallbackTemplate: '',
            footerTemplate: '\nHier könnte Ihre Werbung stehen :-)\n',
            headingTemplate: '\nInhalt der Seite: {{MAINITEM.name}}\n'
        };
    }

}
