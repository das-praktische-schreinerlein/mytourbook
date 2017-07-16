import {SDocRateTechRecord} from './sdoctechrate-record';
describe('SDocRateTechRecord', () => {
    it('should create an instance', () => {
        expect(new SDocRateTechRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocRateTechRecord({
            dist: 5.0
        });
        expect(sdoc.dist).toEqual(5.0);
    });
});
