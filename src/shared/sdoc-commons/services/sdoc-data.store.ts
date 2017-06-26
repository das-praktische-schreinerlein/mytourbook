import {GenericDataStore} from '../../search-commons/services/generic-data.store';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocRecord} from '../model/records/sdoc-record';
import {Facets} from '../../search-commons/model/container/facets';
import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';

export class SDocDataStore extends GenericDataStore<SDocRecord, SDocSearchForm, SDocSearchResult> {

    private validMoreFilterNames = {
        track_id_i: true,
        loc_id_i: true,
        image_id_i: true,
        route_id_i: true,
        loc_parent_id_i: true
    };

    constructor(private searchParameterUtils: SearchParameterUtils) {
        super();
    }

    createQueryFromForm(searchForm: SDocSearchForm): Object {
        const query = {};

        if (searchForm === undefined) {
            searchForm = new SDocSearchForm({});
        }

        let filter = undefined;
        let spatial = undefined;
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            filter = filter || {};
            filter['html'] = {
                'likei': '%' + searchForm.fulltext + '%'
            };
        }
        if (searchForm.when !== undefined && searchForm.when.length > 0) {
            const whenValues = this.searchParameterUtils.splitValuesByPrefixes(searchForm.when, ',', ['week', 'month']);
            if (whenValues.has('week')) {
                filter = filter || {};
                filter['week_is'] = {
                    'in': this.searchParameterUtils.joinValuesAndReplacePrefix(whenValues.get('week'), 'week', ',').split(/,/)
                };
            }
            if (whenValues.has('month')) {
                filter = filter || {};
                filter['month_is'] = {
                    'in': this.searchParameterUtils.joinValuesAndReplacePrefix(whenValues.get('month'), 'month', ',').split(/,/)
                };
            }
        }

        if (searchForm.locId !== undefined && searchForm.locId.length > 0) {
            filter = filter || {};
            filter['loc_id_i'] = {
                'in': searchForm.locId.split(/,/)
            };
        }
        if (searchForm.nearby !== undefined && searchForm.nearby.length > 0) {
            if (searchForm.nearby) {
                spatial = spatial || {};
                spatial['geo_loc_p'] = {
                    'nearby': searchForm.nearby
                };
            }
        }
        if (searchForm.where !== undefined && searchForm.where.length > 0) {
            const whereValues = this.searchParameterUtils.splitValuesByPrefixes(searchForm.where, ',', ['locId', 'nearby']);
            if (whereValues.has('locId')) {
                filter = filter || {};
                filter['loc_id_i'] = {
                    'in': this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('locId'), 'locId', ',').split(/,/)
                };
            }
            if (whereValues.has('nearby')) {
                spatial = spatial || {};
                spatial['geo_loc_p'] = {
                    'nearby': this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('nearby'), 'nearby:', ',')
                };
            }
            if (whereValues.has('unknown')) {
                filter = filter || {};
                filter['loc_lochirarchie_txt'] = {
                    'in': this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('unknown'), '', ',').split(/,/)
                };
            }
        }
        if (searchForm.what !== undefined && searchForm.what.length > 0) {
            filter = filter || {};
            filter['keywords_txt'] = {
                'in': searchForm.what.split(/,/)
            };
        }
        if (searchForm.type !== undefined && searchForm.type.length > 0) {
            filter = filter || {};
            filter['type_txt'] = {
                'in': searchForm.type.split(/,/)
            };
        }
        if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
            filter = filter || {};
            const moreFilters = searchForm.moreFilter.split(/;/);
            for (const index in moreFilters) {
                const moreFilter = moreFilters[index];
                const [filterName, values] = moreFilter.split(/:/);
                if (filterName && values && this.validMoreFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in': values.split(/,/)
                    };
                }
            }
        }

        if (filter !== undefined) {
            query['where'] = filter;
        }
        if (spatial !== undefined) {
            query['spatial'] = spatial;
        }

        return query;
    }

    createSearchResult(searchForm: SDocSearchForm, recordCount: number, records: SDocRecord[], facets: Facets): SDocSearchResult {
        return new SDocSearchResult(searchForm, recordCount, records, facets);
    }

}