// DataStore is mostly recommended for use in the browser
import {Injectable} from '@angular/core';
import {GenericDataStore} from './generic-data.store';

@Injectable()
export class SDocDataStore extends GenericDataStore {
}
