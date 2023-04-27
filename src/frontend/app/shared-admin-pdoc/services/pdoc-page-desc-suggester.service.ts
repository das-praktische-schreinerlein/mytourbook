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
        searchForm.type = 'ROUTE';
    }

    protected getConfiguration(environment: CommonDocListSuggesterEnvironment): CommonDocListSuggesterConfiguration {
        return BeanUtils.getValue(this.appService.getAppConfig(), 'components.pdoc-location-desc-suggester') ||  {
            nameReplacements: this.DEFAULT_NAME_REPLACEMENTS,
            listItemTemplate: '- [{{LISTITEM.name}}](sections/start/show/track/{{LISTITEM.id}})\n',
            listItemsFallbackTemplate: '',
            footerTemplate: '\nAber am Besten ihr schaut selbst :-)\n',
            headingTemplate: '\n{{MAINITEM.name}} als Teil der TODO_PARENTREGION liegt umgeben von TODO_NACHBARN.\n\n' +
                'Mit seinen wunderschönen Bergen, Wäldern, Seen, Museen lädt es geradezu für einen Besuch ein\n\n**Routen**\n'
        };
    }

}
