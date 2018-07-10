import {BaseEntityRecord, BaseEntityRecordType} from './base-entity-record';

export interface BaseImageRecordType extends BaseEntityRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
}

export class BaseImageRecord extends BaseEntityRecord implements BaseImageRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;

    getMediaId(): string {
        return 'notimplemented';
    }
    toString() {
        return 'BaseImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}
