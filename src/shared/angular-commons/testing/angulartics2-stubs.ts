import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class Angulartics2Stub {
    pageTrack = new ReplaySubject();
    virtualPageviews(bla: boolean) {};
}
