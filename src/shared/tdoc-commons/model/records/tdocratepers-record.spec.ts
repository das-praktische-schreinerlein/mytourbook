import {TourDocRatePersonalRecord} from './tdocratepers-record';

describe('TourDocRatePersonalRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocRatePersonalRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocRatePersonalRecord({
            gesamt: 5
        });
        expect(tdoc.gesamt).toEqual(5);
    });
});
