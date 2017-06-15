// DataStore is mostly recommended for use in the browser
import {Injectable} from '@angular/core';
import {GenericDataStore} from './generic-data.store';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocRecord} from '../model/records/sdoc-record';
import {Facets} from '../model/container/facets';

@Injectable()
export class SDocDataStore extends GenericDataStore<SDocRecord, SDocSearchForm, SDocSearchResult> {

    private validMoreFilterNames = {
        track_id_i: true,
        loc_id_i: true,
        image_id_i: true,
        route_id_i: true,
        loc_parent_id_i: true
    };

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
            const whenValues = this.splitValuesByPrefixes(searchForm.when, ',', ['week', 'month']);
            if (whenValues.has('week')) {
                filter = filter || {};
                filter['week_is'] = {
                    'in': this.joinValuesAndReplacePrefix(whenValues.get('week'), 'week', ',').split(/,/)
                };
            }
            if (whenValues.has('month')) {
                filter = filter || {};
                filter['month_is'] = {
                    'in': this.joinValuesAndReplacePrefix(whenValues.get('month'), 'month', ',').split(/,/)
                };
            }
        }
        if (searchForm.where !== undefined && searchForm.where.length > 0) {
            const whenValues = this.splitValuesByPrefixes(searchForm.where, ',', ['locId']);
            if (whenValues.has('locId')) {
                filter = filter || {};
                filter['loc_id_i'] = {
                    'in': this.joinValuesAndReplacePrefix(whenValues.get('locId'), 'locId', ',').split(/,/)
                };
            }
            if (whenValues.has('unknown')) {
                filter = filter || {};
                filter['loc_lochirarchie_txt'] = {
                    'in': this.joinValuesAndReplacePrefix(whenValues.get('unknown'), '', ',').split(/,/)
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

        return query;
    }

    createSearchResult(searchForm: SDocSearchForm, recordCount: number, records: SDocRecord[], facets: Facets): SDocSearchResult {
        return new SDocSearchResult(searchForm, recordCount, records, facets);
    }

    splitValuesByPrefixes(src: string, splitter: string, prefixes: string[]): Map<string, string[]> {
        const result = new Map<string, string[]>();
        const values = src.split(splitter);
        for (const value of values) {
            let found = false;
            for (const prefix of prefixes) {
                if (value.startsWith(prefix)) {
                    let list: string[];
                    if (result.has(prefix)) {
                        list = result.get(prefix);
                    } else {
                        list = [];
                    }
                    list.push(value);
                    result.set(prefix, list);
                    found = true;
                    continue;
                }
            }

            if (!found) {
                const prefix = 'unknown';
                let list: string[];
                if (result.has(prefix)) {
                    list = result.get(prefix);
                } else {
                    list = [];
                }
                list.push(value);
                result.set(prefix, list);
            }
        }

        return result;
    }

    joinValuesAndReplacePrefix(values: string[], prefix: string, joiner: string): string {
        return values.map(function (value) { return value.replace(prefix, ''); }).join(joiner);
    }
}
