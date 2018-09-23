import {
    BaseImageRecord,
    BaseImageRecordFactory,
    BaseImageRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';

export class TourDocImageRecord extends BaseImageRecord {
    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }
    toString() {
        return 'TourDocImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocImageRecordFactory {
    static getSanitizedValues(values: {}): any {
        return BaseImageRecordFactory.getSanitizedValues(values);
    }

    static getSanitizedValuesFromObj(doc: TourDocImageRecord): any {
        return BaseImageRecordFactory.getSanitizedValuesFromObj(doc);
    }

    static createSanitized(values: {}): TourDocImageRecord {
        const sanitizedValues = TourDocImageRecordFactory.getSanitizedValues(values);

        return new TourDocImageRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocImageRecord): TourDocImageRecord {
        const sanitizedValues = TourDocImageRecordFactory.getSanitizedValuesFromObj(doc);

        return new TourDocImageRecord(sanitizedValues);
    }
}

export class TourDocImageRecordValidator extends BaseImageRecordValidator {
    public static instance = new TourDocImageRecordValidator();
}

export let TourDocImageRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
