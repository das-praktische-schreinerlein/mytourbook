import {TrackRecord} from './track-record';

describe('TrackRecord', () => {
  it('should create an instance', () => {
    expect(new TrackRecord()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    const track = new TrackRecord({
      name: 'hello',
      type: 1
    });
    expect(track.name).toEqual('hello');
    expect(track.type).toEqual(1);
  });
});
