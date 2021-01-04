import {CommonAdminCommandConfigType, CommonAdminCommandManager, CommonAdminParameterConfigType} from './common-admin-command.manager';

export interface CommonServerAdminCommandConfigType extends CommonAdminCommandConfigType {
    srcBaseUrl: string,
    destBaseUrl: string,
    backend: string,
    sitemap: string
}

export abstract class CommonServerAdminCommandManager<A extends CommonServerAdminCommandConfigType,
    P extends CommonAdminParameterConfigType> extends CommonAdminCommandManager<A, P> {

    constructor(adminCommandConfig: A) {
        super(adminCommandConfig);
    }

    protected abstract processCommandArgs(argv: {}): Promise<any>;
}

