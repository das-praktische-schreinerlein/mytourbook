import {TourDocRecord} from '../model/records/tdoc-record';
import {TourDocSearchForm} from '../model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../model/container/tdoc-searchresult';
import {GenericSearchHttpAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-search-http.adapter';
import {Mapper, utils} from 'js-data';
import {TourDocAdapterResponseMapper} from './tdoc-adapter-response.mapper';

export class TourDocHttpAdapter extends GenericSearchHttpAdapter<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    private responseMapper: TourDocAdapterResponseMapper;

    constructor(config: any) {
        super(config);
        this.responseMapper = new TourDocAdapterResponseMapper(config);
    }

    create(mapper: Mapper, record: any, opts?: any): Promise<TourDocRecord> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');
        if (opts.realSource) {
            record = opts.realSource;
        }

        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.create(mapper, props, opts);
    }

    update(mapper: Mapper, id: string | number, record: any, opts?: any): Promise<TourDocRecord> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');
        if (opts.realSource) {
            record = opts.realSource;
        }
        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.update(mapper, id, props, opts);
    }

    getHttpEndpoint(method: string, format?: string): string {
        const findMethods = ['find', 'findAll'];
        const updateMethods = ['create', 'destroy', 'update'];
        if (findMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'tdoc';
        }
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'tdocwrite';
        }
        if (method.toLowerCase() === 'doactiontag') {
            return 'tdocaction';
        }
        if (method.toLowerCase() === 'export') {
            return 'tdocexport/' + format;
        }

        return 'tdocsearch';
    }

    private mapRecordToAdapterValues(mapper: Mapper, values: any): {} {
        let record = values;
        if (!(record instanceof TourDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(mapper, values);
        }

        return this.responseMapper.mapToAdapterDocument({}, record);
    }

}

