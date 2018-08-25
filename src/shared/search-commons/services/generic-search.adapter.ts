import {Mapper, Record} from 'js-data';
import {Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';

export interface GenericSearchAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> {
    search(mapper: Mapper, query: any, opts: any): Promise<S>;
}

export interface GenericFacetAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> {
    facets(mapper: Mapper, query: any, opts: any): Promise<Facets>;
}

export interface GenericActionTagAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> {
    doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<R>;
}

