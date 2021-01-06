import {
    CommonAdminCommandConfigType,
    CommonAdminCommandManager,
    CommonAdminCommandsRequestType,
    CommonAdminParameterConfigType
} from './common-admin-command.manager';
import {CommonAdminCommand} from './common-admin.command';

// TODO move to commons
export interface CommonServerAdminCommandConfigType extends CommonAdminCommandConfigType {
    srcBaseUrl: string,
    destBaseUrl: string,
    backend: string,
    sitemap: string
}

// TODO move to commons
export abstract class CommonServerAdminCommandManager<A extends CommonServerAdminCommandConfigType,
    P extends CommonAdminParameterConfigType> extends CommonAdminCommandManager<A, P> {

    protected restrictedCommandActions: string[];

    constructor(commands: {[key: string]: CommonAdminCommand}, adminCommandConfig: A, restrictedCommandActions: string[]) {
        super(commands, adminCommandConfig);
        this.restrictedCommandActions = restrictedCommandActions;
    }

    protected initializeCommand(argv: {}): Promise<CommonAdminCommandsRequestType> {
        return super.initializeCommand(argv).then(command => {
            const requestedAction = argv['action'];
            if (requestedAction !== undefined
                && !(this.restrictedCommandActions.length === 1 && this.restrictedCommandActions[0] === '*')
                && !this.restrictedCommandActions.includes(requestedAction)) {
                return Promise.reject('action not allowed on adminserver');
            }

            return Promise.resolve(command);
        })
    }

}

