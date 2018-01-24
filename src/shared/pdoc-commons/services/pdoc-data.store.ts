import {GenericDataStore} from '../../search-commons/services/generic-data.store';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocRecord} from '../model/records/pdoc-record';
import {Facets} from '../../search-commons/model/container/facets';
import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';

export class PDocDataStore extends GenericDataStore<PDocRecord, PDocSearchForm, PDocSearchResult> {

    private validMoreFilterNames = {
    };

    constructor(private searchParameterUtils: SearchParameterUtils) {
        super([]);
    }

    createQueryFromForm(searchForm: PDocSearchForm): Object {
        const query = {};

        if (searchForm === undefined) {
            return query;
        }

        let filter = undefined;
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            filter = filter || {};
            filter['html'] = {
                'likei': '%' + searchForm.fulltext + '%'
            };
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

        return query;
    }

    createSearchResult(searchForm: PDocSearchForm, recordCount: number, records: PDocRecord[], facets: Facets): PDocSearchResult {
        return new PDocSearchResult(searchForm, recordCount, records, facets);
    }

}
