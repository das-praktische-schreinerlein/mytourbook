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
export class TourDocTripDescSuggesterService extends CommonDocListSuggesterService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {

    constructor(protected tourDocDataService: TourDocDataService, protected appService: GenericAppService) {
        super(tourDocDataService);
    }

    protected appendFiltersToListItemSearchForm(searchForm: TourDocSearchForm, form: {}, environment: CommonDocListSuggesterEnvironment) {
        searchForm.sort = 'dateAsc';
        searchForm.perPage = 99;
        searchForm.type = 'TRACK';
        searchForm.moreFilter = 'trip_id_is:' + (form['id'] ? form['id'].replace(/[-a-zA-Z_]+/g, '') : 999999999999999);
    }

    protected getConfiguration(environment: CommonDocListSuggesterEnvironment): CommonDocListSuggesterConfiguration {
        return BeanUtils.getValue(this.appService.getAppConfig(), 'components.tdoc-trip-desc-suggester') || {
            nameReplacements: this.DEFAULT_NAME_REPLACEMENTS,
            listItemTemplate: '- [{{LISTITEM.name}}](sections/start/show/track/{{LISTITEM.id}})\n',
            listItemsFallbackTemplate: '',
            footerTemplate: '\nMehr dazu auf den nächsten Seiten\n',
            headingTemplate: '**Was für ein Trip**\n\n'
        };
    }

}
