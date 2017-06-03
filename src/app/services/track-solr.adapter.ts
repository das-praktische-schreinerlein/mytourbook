import {Injectable} from '@angular/core';
import {Jsonp} from '@angular/http';
import {GenericSolrAdapter} from './generic-solr.adapter';
import {Mapper, Record} from 'js-data';

@Injectable()
export class TrackSolrAdapter extends GenericSolrAdapter {
    constructor(config: any, jsonP: Jsonp) {
        super(config, jsonP);
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        opts = opts || {};
        opts.endpoint = 'select?';

        return super.count(mapper, query, opts);
    }

    create<T extends Record>(mapper: Mapper, props: any, opts?: any): Promise<T> {
        opts = opts || {};
        opts.endpoint = 'update?';

        return super.create(mapper, props, opts);
    }

    destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
        opts = opts || {};
        opts.endpoint = 'update?';

        return super.destroy(mapper, id, opts);
    }

    find<T extends Record>(mapper: Mapper, id: string | number, opts: any): Promise<T> {
        opts = opts || {};
        opts.endpoint = 'select?';

        return super.find(mapper, id, opts);
    }

    findAll<T extends Record>(mapper: Mapper, query: any, opts: any): Promise<T[]> {
        opts = opts || {};
        opts.endpoint = 'select?';

        return super.findAll(mapper, query, opts);
    }

    update<T extends Record>(mapper: Mapper, id: string | number, props: any, opts: any): Promise<T> {
        opts = opts || {};
        opts.endpoint = 'update?';

        return super.update(mapper, id, props, opts);
    }

    mapToSolrFieldName(fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return 'name_txt';
            case 'desc':
                return 'html_txt';
            default:
                break;
        }

        return super.mapToSolrFieldName(fieldName);
    }

    mapToSolrDocument(props: any): any {
        return {
            id: props.id,
            name_txt: props.name,
            html_txt: props.desc
        };
    }

    mapSolrDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['name'] = this.getSolrValue(doc, 'name_txt', undefined);
        values['id'] = Number(this.getSolrValue(doc, 'id', undefined));
        values['desc'] = this.getSolrValue(doc, 'html_txt', undefined);
        // console.log('mapSolrDocument values:', values);
        const record: Record = mapper.createRecord(values);
        //  console.log('mapSolrDocument record:', record);
        return record;
    }
}

