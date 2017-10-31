import {Adapter} from 'js-data-adapter';
import {DataStore, Mapper, Record} from 'js-data';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

export abstract class GenericInMemoryAdapter <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> extends Adapter {

    constructor(config: any) {
        super(config);
    }

    _count(mapper: Mapper, query: any, opts?: any): Promise<any> {
        return Promise.resolve((<DataStore>mapper['datastore']).filter(mapper.name, query, opts));
    }
    _create(mapper: any, props: any, opts?: any): Promise<any> {
        return Promise.resolve((<DataStore>mapper['datastore']).add(mapper.name, props));
    }
    _createMany(mapper: any, props: any, opts?: any): Promise<any> {
        return Promise.resolve((<DataStore>mapper['datastore']).add(mapper.name, props));
    }
    _destroy(mapper: any, id: string | number, opts?: any): Promise<any> {
        return Promise.resolve((<DataStore>mapper['datastore']).remove(mapper.name, id, opts));
    }
    _destroyAll(mapper: any, query: any, opts?: any): Promise<any> {
        return Promise.reject('destroyAll not implemented');
    }
    _find(mapper: any, id: string | number, opts?: any): Promise<any> {
        return Promise.resolve([(<DataStore>mapper['datastore']).get(mapper.name, id)]);
    }
    _findAll(mapper: any, query: any, opts?: any): Promise<any> {
        return Promise.resolve([(<DataStore>mapper['datastore']).getAll(mapper.name, query)]);
    }
    _sum(mapper: any, field: any, query: any, opts?: any): Promise<any> {
        return Promise.reject('sum not implemented');
    }
    _update(mapper: any, id: any, props: any, opts?: any): Promise<any> {
        if (id === undefined || id === null) {
            return Promise.reject('cant update records without id');
        }
        const readRecord: any = (<DataStore>mapper['datastore']).get(mapper.name, id);
        if (readRecord === undefined || readRecord === null) {
            return Promise.resolve(null);
        }

        props.id = id;
        return Promise.resolve((<DataStore>mapper['datastore']).add(mapper.name, props, opts));
    }
    _updateAll(mapper: any, props: any, query: any, opts?: any): Promise<any> {
        return Promise.reject('updateAll not implemented');
    }
    _updateMany(mapper: any, records: any, opts?: any): Promise<any> {
        return Promise.reject('updateMany not implemented');
    }
}

