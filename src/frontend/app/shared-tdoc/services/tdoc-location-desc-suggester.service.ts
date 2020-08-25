import {Injectable} from '@angular/core';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {
    CommonDocListSuggesterConfiguration,
    CommonDocListSuggesterEnvironment,
    CommonDocListSuggesterService
} from './common-doc-list-suggester.service';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Injectable()
export class TourDocLocationDescSuggesterService
    extends CommonDocListSuggesterService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {

    constructor(protected tourDocDataService: TourDocDataService, protected appService: GenericAppService) {
        super(tourDocDataService);
    }

    protected appendFiltersToListItemSearchForm(searchForm: TourDocSearchForm, form: {}, environment: CommonDocListSuggesterEnvironment) {
        searchForm.sort = 'ratePers';
        searchForm.perPage = 20;
        searchForm.type = 'ROUTE';
        searchForm.where = '' + (form['id'] ? form['name'] : 'XXXXXXXX');
    }

    protected getConfiguration(environment: CommonDocListSuggesterEnvironment): CommonDocListSuggesterConfiguration {
        return BeanUtils.getValue(this.appService.getAppConfig(), 'components.tdoc-location-desc-suggester') ||  {
            nameReplacements: this.DEFAULT_NAME_REPLACEMENTS,
            listItemTemplate: '- [{{LISTITEM.name}}](sections/start/show/track/{{LISTITEM.id}})\n',
            listItemsFallbackTemplate: '',
            footerTemplate: '\nAber am Besten ihr schaut selbst :-)\n',
            headingTemplate: '\n{{MAINITEM.name}} als Teil der TODO_PARENTREGION liegt umgeben von TODO_NACHBARN.\n\n' +
                'Mit seinen wunderschönen Bergen, Wäldern, Seen, Museen lädt es geradezu für einen Besuch ein\n\n**Routen**\n'
        };
    }

}
