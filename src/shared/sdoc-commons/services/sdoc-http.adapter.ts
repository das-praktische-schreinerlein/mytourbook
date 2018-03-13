import {SDocRecord} from '../model/records/sdoc-record';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../model/container/sdoc-searchresult';
import {GenericSearchHttpAdapter} from '../../search-commons/services/generic-search-http.adapter';
import {Mapper, Record} from 'js-data';
import {SDocAdapterResponseMapper} from './sdoc-adapter-response.mapper';

export class SDocHttpAdapter extends GenericSearchHttpAdapter<SDocRecord, SDocSearchForm, SDocSearchResult> {
    private responseMapper: SDocAdapterResponseMapper;

    constructor(config: any) {
        super(config);
        this.responseMapper = new SDocAdapterResponseMapper(config);
    }

    create<T extends Record>(mapper: Mapper, record: any, opts?: any): Promise<T> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');
        if (opts.realSource) {
            record = opts.realSource;
        }

        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.create(mapper, props, opts);
    }

    update<T extends Record>(mapper: Mapper, id: string | number, record: any, opts?: any): Promise<T> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');
        if (opts.realSource) {
            record = opts.realSource;
        }
        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.update(mapper, id, props, opts);
    }

    getHttpEndpoint(method: string): string {
        const findMethods = ['find', 'findAll'];
        const updateMethods = ['create', 'destroy', 'update'];
        if (findMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'sdoc';
        }
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'sdocwrite';
        }
        if (method.toLowerCase() === 'doactiontag') {
            return 'sdocaction';
        }

        return 'sdocsearch';
    }

    private mapRecordToAdapterValues(mapper: Mapper, values: any): {} {
        let record = values;
        if (!(record instanceof SDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(mapper, values);
        }

        return this.responseMapper.mapToAdapterDocument({}, record);
    }
}

