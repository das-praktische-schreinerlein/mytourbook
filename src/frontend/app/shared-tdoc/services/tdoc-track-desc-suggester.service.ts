import {Injectable} from '@angular/core';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {
    CommonDocListSuggesterConfiguration,
    CommonDocListSuggesterEnvironment,
    CommonDocListSuggesterService
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-list-suggester.service';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Injectable()
export class TourDocTrackDescSuggesterService extends CommonDocListSuggesterService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {

    constructor(protected tourDocDataService: TourDocDataService, protected appService: GenericAppService) {
        super(tourDocDataService);
    }

    protected appendFiltersToListItemSearchForm(searchForm: TourDocSearchForm, form: {}, environment: CommonDocListSuggesterEnvironment) {
        searchForm.sort = 'name';
        searchForm.perPage = 99;
        searchForm.type = 'ROUTE';
        searchForm.moreFilter = 'track_id_is:' + (form['id'] ? form['id'].replace(/[-a-zA-Z_]+/g, '') : 999999999999999);
    }

    protected getConfiguration(environment: CommonDocListSuggesterEnvironment): CommonDocListSuggesterConfiguration {
        return BeanUtils.getValue(this.appService.getAppConfig(), 'components.tdoc-track-desc-suggester') || {
            nameReplacements: this.DEFAULT_NAME_REPLACEMENTS,
            listItemTemplate: '- [{{LISTITEM.name}}](sections/start/show/route/{{LISTITEM.id}})\n',
            listItemsFallbackTemplate: '',
            footerTemplate: '\nMehr dazu auf den nächsten Seiten\n',
            headingTemplate: '**Was für ein Ausflug**\n\n'
        };
    }

}
