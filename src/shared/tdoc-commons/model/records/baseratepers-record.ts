import {BaseEntityRecord, BaseEntityRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export interface BaseRatePersonalRecordType extends BaseEntityRecordType {
    ausdauer: number;
    bildung: number;
    gesamt: number;
    kraft: number;
    mental: number;
    motive: number;
    schwierigkeit: number;
    wichtigkeit: number;
}

export class BaseRatePersonalRecord extends BaseEntityRecord implements BaseRatePersonalRecordType {
    ausdauer: number;
    bildung: number;
    gesamt: number;
    kraft: number;
    mental: number;
    motive: number;
    schwierigkeit: number;
    wichtigkeit: number;

    toString() {
        return 'BaseRatePersonalRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  gesamt: ' + this.gesamt + ',\n' +
            '}';
    }
}
