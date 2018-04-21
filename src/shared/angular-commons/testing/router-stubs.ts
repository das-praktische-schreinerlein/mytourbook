import {Injectable} from '@angular/core';

@Injectable()
export class RouterStub {
    public routerState: {} = {
        snapshot: {
            url: 'record'
        }
    };
    public events: {} = {
        subscribe: function () {}
    };

    public queryParamMap: {} = {
        subscribe: function () {}
    };

    public fragment: {} = {
        subscribe: function () {}
    };

    navigateByUrl(url: string) { return url; }
}
