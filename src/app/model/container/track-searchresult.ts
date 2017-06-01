import {TrackSearchForm} from '../forms/track-searchform';
import {TrackRecord} from '../records/track-record';
export class TrackSearchResult {
    currentRecords: TrackRecord[];
    recordCount: number;
    trackSearchForm: TrackSearchForm;

    constructor(trackSearchForm: TrackSearchForm, recordCount: number, currentRecords: TrackRecord[]) {
        this.currentRecords = currentRecords;
        this.recordCount = recordCount;
        this.trackSearchForm = trackSearchForm;
    }

    toString() {
        return 'TrackSearchResult {\n' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  trackSearchForm: ' + this.trackSearchForm + '' +
            '  trackSearchForm: ' + this.trackSearchForm + '' +
            '}';
    }
}
