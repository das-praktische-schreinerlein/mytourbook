import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SimpleAngularBackendHttpClient} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-angular-backend-http-client';

@Injectable()
export class BackendHttpClient extends SimpleAngularBackendHttpClient {
    constructor(http: HttpClient) {
        super(http);
    }
}
