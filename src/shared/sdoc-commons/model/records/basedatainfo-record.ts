import {BaseEntityRecord, BaseEntityRecordType} from '../../../search-commons/model/records/base-entity-record';

export interface BaseDataInfoRecordType extends BaseEntityRecordType {
    baseloc: string;
    destloc: string;
    guides: string;
    region: string;
}

export class BaseDataInfoRecord extends BaseEntityRecord implements BaseDataInfoRecordType {
    baseloc: string;
    destloc: string;
    guides: string;
    region: string;

    toString() {
        return 'BaseDataTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  baseloc: ' + this.baseloc + ',\n' +
            '  destloc: ' + this.destloc + ',\n' +
            '  guides: ' + this.guides + ',\n' +
            '  region: ' + this.region + ',\n' +
            '}';
    }
}
