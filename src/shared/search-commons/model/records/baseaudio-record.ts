import {BaseEntityRecord, BaseEntityRecordType} from './base-entity-record';

export interface BaseAudioRecordType extends BaseEntityRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
}

export class BaseAudioRecord extends BaseEntityRecord implements BaseAudioRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;

    getMediaId(): string {
        return 'notimplemented';
    }
    toString() {
        return 'BaseAudioRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}
