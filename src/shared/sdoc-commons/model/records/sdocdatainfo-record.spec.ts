import {SDocDataInfoRecord} from './sdocdatainfo-record';

describe('SDocDataInfoRecord', () => {
    it('should create an instance', () => {
        expect(new SDocDataInfoRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdoc = new SDocDataInfoRecord({
            region: 'Dolomiten'
        });
        expect(sdoc.region).toEqual('Dolomiten');
    });
});
