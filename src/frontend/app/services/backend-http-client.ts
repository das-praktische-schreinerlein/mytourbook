import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {SimpleAngularBackendHttpClient} from '../../shared/angular-commons/services/simple-angular-backend-http-client';

@Injectable()
export class BackendHttpClient extends SimpleAngularBackendHttpClient {
    constructor(http: Http) {
        super(http);
    }
}


