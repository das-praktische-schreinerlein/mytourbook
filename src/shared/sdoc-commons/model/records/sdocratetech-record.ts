import {BaseEntityRecord} from '../../../search-commons/model/records/base-entity-record';

export class SDocRateTechRecord extends BaseEntityRecord {
    bergtour: string;
    firn: string;
    gletscher: string;
    klettern: string;
    ks: string;
    overall: string;
    schneeschuh: string;
    sdoc_id: string;

    toString() {
        return 'SDocRateTechRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  overall: ' + this.overall + ',\n' +
            '  sdoc_id: ' + this.sdoc_id + '' +
            '}';
    }
}

export let SDocRateTechRecordRelation: any = {
    belongsTo: {
        sdoc: {
            // database column
            foreignKey: 'sdoc_id',
            // reference to related object in memory
            localField: 'sdoc'
        }
    }
};
