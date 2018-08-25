import {TourDocDataTechRecord} from './tdocdatatech-record';

describe('TourDocDataTechRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocDataTechRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocDataTechRecord({
            dist: 5.0
        });
        expect(tdoc.dist).toEqual(5.0);
    });
});
