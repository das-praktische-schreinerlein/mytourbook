import {TourDocDataInfoRecord} from './tdocdatainfo-record';

describe('TourDocDataInfoRecord', () => {
    it('should create an instance', () => {
        expect(new TourDocDataInfoRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdoc = new TourDocDataInfoRecord({
            region: 'Dolomiten'
        });
        expect(tdoc.region).toEqual('Dolomiten');
    });
});
