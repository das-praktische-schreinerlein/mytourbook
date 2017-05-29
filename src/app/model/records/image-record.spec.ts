import {ImageRecord} from './image-record';

describe('ImageRecord', () => {
    it('should create an instance', () => {
        expect(new ImageRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const track = new ImageRecord({
            name: 'hello',
            fileName: 'img1.jpg'
        });
        expect(track.name).toEqual('hello');
        expect(track.fileName).toEqual('img1.jpg');
    });
});
