import {SDocDateTechRecord} from './sdocdatetech-record';
describe('SDocDateTechRecord', () => {
    it('should create an instance', () => {
        expect(new SDocDateTechRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocDateTechRecord({
            dist: 5.0
        });
        expect(sdoc.dist).toEqual(5.0);
    });
});
