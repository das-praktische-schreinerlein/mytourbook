import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

export interface ResolvedData<S> {
    route: ActivatedRouteSnapshot;
    state: RouterStateSnapshot;
    data?: S;
    error?: ResolverError;
}
export class ResolverError {
    private _code: string;
    private _data: any;
    private _errorData: any;

    constructor(code: string, data: any, errorData: any) {
        this._code = code;
        this._data = data;
        this._errorData = errorData;
    }


    get code(): string {
        return this._code;
    }

    get data(): any {
        return this._data;
    }

    get errorData(): any {
        return this._errorData;
    }
}

