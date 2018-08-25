import {TourDocRateTechRecord} from './tdocratetech-record';

describe('TourDocRateTechRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocRateTechRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocRateTechRecord({
            overall: '5'
        });
        expect(tdoc.overall).toEqual('5');
    });
});
