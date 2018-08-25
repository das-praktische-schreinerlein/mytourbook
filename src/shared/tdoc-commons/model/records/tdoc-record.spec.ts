import {TourDocRecord} from './tdoc-record';

describe('TourDocRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocRecord({
            name: 'hello',
            type: 'TRACK'
        });
        expect(tdoc.name).toEqual('hello');
        expect(tdoc.type).toEqual('TRACK');
    });
});
