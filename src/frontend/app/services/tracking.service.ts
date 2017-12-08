import {Injectable} from '@angular/core';
import {Angulartics2} from 'angulartics2';
import {Angulartics2Piwik} from 'angulartics2/piwik';
import {GenericTrackingService} from '../../shared/angular-commons/services/generic-tracking.service';
import {environment} from '../../environments/environment';

@Injectable()
export class TrackingService extends GenericTrackingService {
    private static config = {
        providers: environment.trackingProviders
    };

    static getTrackingProvider(): Object[] {
        return TrackingService.config.providers;
    }

    constructor(angulartics2: Angulartics2, private angulartics2piwik: Angulartics2Piwik) {
        super(angulartics2);
    }
}
