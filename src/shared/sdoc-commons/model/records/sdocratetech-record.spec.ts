import {SDocRateTechRecord} from './sdocratetech-record';

describe('SDocRateTechRecord', () => {
    it('should create an instance', () => {
        expect(new SDocRateTechRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocRateTechRecord({
            overall: '5'
        });
        expect(sdoc.overall).toEqual('5');
    });
});
