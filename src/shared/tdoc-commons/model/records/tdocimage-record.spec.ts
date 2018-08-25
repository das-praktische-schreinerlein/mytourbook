import {TourDocImageRecord} from './tdocimage-record';

describe('TourDocImageRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocImageRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocImageRecord({
            name: 'hello',
            fileName: 'img1.jpg'
        });
        expect(tdoc.name).toEqual('hello');
        expect(tdoc.fileName).toEqual('img1.jpg');
    });
});
