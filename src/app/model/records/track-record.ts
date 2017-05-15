import {BaseEntityRecord} from './base-entity-record';

export class TrackRecord extends BaseEntityRecord {
    desc: string;
    name: string;
    persons: string;
    type: number;

    toString() {
        return 'TrackRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  desc: ' + this.desc + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  persons: ' + this.persons + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }
}
