import {BaseEntityRecord, BaseEntityRecordType} from '../../../search-commons/model/records/base-entity-record';

export interface BaseRateTechRecordType extends BaseEntityRecordType {
    bergtour: string;
    firn: string;
    gletscher: string;
    klettern: string;
    ks: string;
    overall: string;
    schneeschuh: string;
}

export class BaseRateTechRecord extends BaseEntityRecord implements BaseRateTechRecordType {
    bergtour: string;
    firn: string;
    gletscher: string;
    klettern: string;
    ks: string;
    overall: string;
    schneeschuh: string;

    toString() {
        return 'BaseRateTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  overall: ' + this.overall + ',\n' +
            '}';
    }
}
