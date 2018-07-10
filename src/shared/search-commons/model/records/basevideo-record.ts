import {BaseImageRecord, BaseImageRecordType} from './baseimage-record';

export interface BaseVideoRecordType extends BaseImageRecordType {
    toString(): string;
}

export class BaseVideoRecord extends BaseImageRecord implements BaseVideoRecordType {
    toString() {
        return 'BaseVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    }
}
