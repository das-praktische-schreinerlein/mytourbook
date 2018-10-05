import {
    BaseVideoRecord,
    BaseVideoRecordFactory,
    BaseVideoRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';

export class TourDocVideoRecord extends BaseVideoRecord {
    tdoc_id: string;

    getMediaId(): string {
        return this.tdoc_id;
    }

    toString() {
        return 'TourDocVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  tdoc_id: ' + this.tdoc_id + '' +
            '}';
    }
}

export class TourDocVideoRecordFactory extends BaseVideoRecordFactory {
    public static instance = new TourDocVideoRecordFactory();

    static createSanitized(values: {}): TourDocVideoRecord {
        const sanitizedValues = TourDocVideoRecordFactory.instance.getSanitizedValues(values, {});
        return new TourDocVideoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: TourDocVideoRecord): TourDocVideoRecord {
        const sanitizedValues = TourDocVideoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new TourDocVideoRecord(sanitizedValues);
    }
}

export class TourDocVideoRecordValidator extends BaseVideoRecordValidator {
    public static instance = new TourDocVideoRecordValidator();
}

export let TourDocVideoRecordRelation: any = {
    belongsTo: {
        tdoc: {
            // database column
            foreignKey: 'tdoc_id',
            // reference to related object in memory
            localField: 'tdoc'
        }
    }
};
