// DataStore is mostly recommended for use in the browser
import {Injectable} from '@angular/core';
import {GenericDataStore} from './generic-data.store';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocRecord} from '../model/records/sdoc-record';
import {Facets} from '../model/container/facets';

@Injectable()
export class SDocDataStore extends GenericDataStore<SDocRecord, SDocSearchForm, SDocSearchResult> {
    createQueryFromForm(searchForm: SDocSearchForm): Object {
        const query = {};

        if (searchForm === undefined) {
            searchForm = new SDocSearchForm({});
        }

        let filter = undefined;
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            filter = filter || {};
            filter['html'] = {
                'likei': '%' + searchForm.fulltext + '%'
            };
        }
        if (searchForm.when !== undefined && searchForm.when.length > 0) {
            if (searchForm.when.startsWith('week')) {
                filter = filter || {};
                filter['week_is'] = {
                    '==': searchForm.when.replace('week', '')
                };
            } else if (searchForm.when.startsWith('month')) {
                filter = filter || {};
                filter['month_is'] = {
                    '==': searchForm.when.replace('month', '')
                };
            }
        }
        if (searchForm.where !== undefined && searchForm.where.length > 0) {
            if (searchForm.where.startsWith('locId')) {
                filter = filter || {};
                filter['loc_id_i'] = {
                    '==': searchForm.where.replace('locId', '')
                };
            } else {
                filter = filter || {};
                filter['loc_lochirarchie_txt'] = {
                    '==': searchForm.where
                };
            }
        }
        if (searchForm.what !== undefined && searchForm.what.length > 0) {
            filter = filter || {};
            filter['keywords_txt'] = {
                '==': searchForm.what
            };
        }
        if (searchForm.type !== undefined && searchForm.type.length > 0) {
            filter = filter || {};
            filter['type_txt'] = {
                '==': searchForm.type
            };
        }

        if (filter !== undefined) {
            query['where'] = filter;
        }

        return query;
    }

    createSearchResult(searchForm: SDocSearchForm, recordCount: number, records: SDocRecord[], facets: Facets): SDocSearchResult {
        return new SDocSearchResult(searchForm, recordCount, records, facets);
    }
}
