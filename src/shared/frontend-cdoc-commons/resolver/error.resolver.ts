import {ToastsManager} from 'ng2-toastr';
import {Injectable} from '@angular/core';
import {ResolvedData, ResolverError} from '../../angular-commons/resolver/resolver.utils';
import {CommonRoutingService} from '../../angular-commons/services/common-routing.service';

@Injectable()
export class ErrorResolver {
    static ERROR_INVALID_ID = 'ERROR_INVALID_ID';
    static ERROR_UNKNOWN_ID = 'ERROR_UNKNOWN_ID';
    static ERROR_INVALID_DATA = 'ERROR_INVALID_DATA';
    static ERROR_WHILE_READING = 'ERROR_WHILE_READING';
    static ERROR_APP_NOT_INITIALIZED = 'ERROR_APP_NOT_INITIALIZED';
    static ERROR_READONLY = 'ERROR_READONLY';
    static ERROR_OTHER = 'ERROR_OTHER';

    static isResolverError(resolvedData: ResolvedData<any>): boolean {
        if (!resolvedData || !resolvedData.error) {
            return false;
        }

        if (resolvedData.error instanceof ResolverError && resolvedData.error !== undefined) {
            return true;
        }

        return false;
    }

    constructor(private commonRoutingService: CommonRoutingService) {
    }

    redirectAfterRouterError(errorCode: string, newUrl: string, toasts: ToastsManager, toastMessage: string) {
        if (toasts) {
            let msg = '';
            if (toastMessage) {
                msg = toastMessage;
            } else {
                switch (errorCode) {
                    case ErrorResolver.ERROR_INVALID_ID:
                        msg = 'Der Url ist leider nicht korrekt. Wir haben versucht ihn zu berichtigen und ' +
                            'leiten Sie auf die hoffentlich richtige Seite weiter.';
                        break;
                    case ErrorResolver.ERROR_INVALID_DATA:
                        msg = 'Einige Daten waren leider nicht korrekt. Wir haben versucht sie zu berichtigen und ' +
                            'leiten Sie auf die hoffentlich richtige Seite weiter.';
                        break;
                    case ErrorResolver.ERROR_UNKNOWN_ID:
                        msg = 'Die Seite wurde leider nicht gefunden. Wir leiten Sie deshalb zur letzten Suche weiter.';
                        break;
                    case ErrorResolver.ERROR_APP_NOT_INITIALIZED:
                        msg = 'Die Anwendung konnte leider nicht richtig gestartet werden. Probieren Sie es später noch einmal.';
                        newUrl = 'errorpage';
                        break;
                    case ErrorResolver.ERROR_READONLY:
                        msg = 'Die Daten sind nicht zur Bearbeitung freigegeben..';
                        newUrl = 'errorpage';
                        break;
                    default:
                        msg = 'Es gibt leider Probleme beim Lesen - am besten noch einmal probieren :-(';
                }

            }
            toasts.error(msg, 'Oje!');
        }

        if (newUrl) {

            console.log('after error ' + errorCode +  ' redirect to', newUrl);
            this.commonRoutingService.navigateByUrl(newUrl);
        }
    }
}
