import {SDocDataTechRecord} from './sdocdatatech-record';

describe('SDocDataTechRecord', () => {
    it('should create an instance', () => {
        expect(new SDocDataTechRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocDataTechRecord({
            dist: 5.0
        });
        expect(sdoc.dist).toEqual(5.0);
    });
});
