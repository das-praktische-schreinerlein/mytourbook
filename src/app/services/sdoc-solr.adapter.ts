import {Injectable} from '@angular/core';
import {Jsonp} from '@angular/http';
import {GenericSolrAdapter} from './generic-solr.adapter';
import {Mapper, Record} from 'js-data';
import {SDocRecord} from '../model/records/sdoc-record';
import {SDocImageRecord} from '../model/records/sdocimage-record';

@Injectable()
export class SDocSolrAdapter extends GenericSolrAdapter {
    constructor(config: any, jsonP: Jsonp) {
        super(config, jsonP);
    }

    mapToSolrFieldName(fieldName: string): string {
        switch (fieldName) {
            case 'name':
                return 'name_txt';
            case 'html':
                return 'html_txt';
            case 'desc':
                return 'desc_txt';
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
        const imageMapper = mapper['datastore']._mappers['sdocimage'];

        const values = {};
        values['name'] = this.getSolrValue(doc, 'name_txt', undefined);
        values['id'] = Number(this.getSolrValue(doc, 'id', undefined));
        values['html'] = this.getSolrValue(doc, 'html_txt', undefined);

        values['datevon'] = this.getSolrValue(doc, 'date_dt', undefined);
        values['desc'] = this.getSolrValue(doc, 'desc_txt', undefined);
        values['keywords'] = this.getSolrValue(doc, 'keywords_txt', undefined).split(',,').join(', ').replace(/KW_/g, '');
        values['persons'] = this.getSolrValue(doc, 'personen_txt', undefined).split(',,').join(', ');
        values['gpssdocsBasefile'] = this.getSolrValue(doc, 'gpssdocs_basefile_txt', undefined);
        // console.log('mapSolrDocument values:', values);

        const record: SDocRecord = <SDocRecord>mapper.createRecord(values);

        const images: SDocImageRecord[] = [];
        let id = record.id * 100000;
        for (const imageDoc of doc['i_url_txt']) {
            const imageValues = {};
            imageValues['name'] = values['name'];
            imageValues['id'] = id++;
            imageValues['desc'] = values['desc'];
            imageValues['fileName'] = imageDoc;
            const imageRecord = imageMapper.createRecord(imageValues);
            images.push(imageRecord);
        }
        record.set('sdocimages', images);
        // console.log('mapSolrDocument record:', record);

        return record;
    }

    getSolrEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    }
}

