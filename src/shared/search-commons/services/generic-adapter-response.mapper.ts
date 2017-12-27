import {Mapper, Record} from 'js-data';

export interface GenericAdapterResponseMapper {
    mapToAdapterDocument(mapping: {}, props: any): any;

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}, opts: any): Record;
}

