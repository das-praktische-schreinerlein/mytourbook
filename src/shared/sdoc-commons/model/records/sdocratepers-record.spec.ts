import {SDocRatePersonalRecord} from './sdocratepers-record';
describe('SDocRatePersonalRecord', () => {
    it('should create an instance', () => {
        expect(new SDocRatePersonalRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocRatePersonalRecord({
            gesamt: 5
        });
        expect(sdoc.gesamt).toEqual(5);
    });
});
