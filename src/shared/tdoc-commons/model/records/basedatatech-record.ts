import {BaseEntityRecord, BaseEntityRecordType} from '../../../search-commons/model/records/base-entity-record';

export interface BaseDataTechRecordType extends BaseEntityRecordType {
    altAsc: number;
    altDesc: number;
    altMax: number;
    altMin: number;
    dist: number;
    dur: number;
}

export class BaseDataTechRecord extends BaseEntityRecord implements BaseDataTechRecordType {
    altAsc: number;
    altDesc: number;
    altMax: number;
    altMin: number;
    dist: number;
    dur: number;

    toString() {
        return 'BaseDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  altAsc: ' + this.altAsc + ',\n' +
            '  altDesc: ' + this.altDesc + ',\n' +
            '  altMax: ' + this.altMax + ',\n' +
            '  altMin: ' + this.altMin + ',\n' +
            '  dist: ' + this.dist + ',\n' +
            '  dur: ' + this.dur + ',\n' +
            '}';
    }
}
