import {SDocImageRecord} from './sdocimage-record';

describe('SDocImageRecord', () => {
    it('should create an instance', () => {
        expect(new SDocImageRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocImageRecord({
            name: 'hello',
            fileName: 'img1.jpg'
        });
        expect(sdoc.name).toEqual('hello');
        expect(sdoc.fileName).toEqual('img1.jpg');
    });
});
