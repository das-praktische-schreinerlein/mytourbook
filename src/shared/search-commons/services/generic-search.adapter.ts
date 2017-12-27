import {Mapper, Record} from 'js-data';
import {Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';

export interface GenericSearchAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> {
    search<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<S>;
}

export interface GenericFacetAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> {
    facets<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<Facets>;
}

