import {BaseEntityRecordFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export interface CommonAdminCommandConfigType {
    adminWritable: boolean;
    commands: string[];
    actions: string[];
    constantParameters: {[key: string]: string};
}

export interface CommonAdminParameterConfigType {
    parameters: {[key: string]: BaseEntityRecordFieldConfig};
}

export abstract class CommonAdminCommandManager<A extends CommonAdminCommandConfigType, P extends CommonAdminParameterConfigType> {
    protected adminCommandConfig: A;

    constructor(adminCommandConfig: A) {
        this.adminCommandConfig = adminCommandConfig;
    }

    public process(argv): Promise<any> {
        const me = this;
        return this.initializeArgs(argv).then(initializedArgs => {
            return me.validateCommand(initializedArgs);
        }).then(validatedCommandArgs => {
            return me.validateCommandParameters(validatedCommandArgs);
        }).then(validatedArgs => {
            return me.processCommandArgs(validatedArgs);
        });
    }

    // TODO
    protected initializeArgs(argv: {}): Promise<{}> {
        return Promise.resolve(argv);
    }

    protected validateCommand(argv: {}): Promise<{}> {
        if (this.adminCommandConfig === undefined || this.adminCommandConfig.adminWritable !== true) {
            return Promise.reject('adminCommandConfig.adminWritable not active');
        }

        if (this.adminCommandConfig.commands === undefined ||
            !Array.isArray(this.adminCommandConfig.commands)) {
            return Promise.reject('adminCommandConfig.commands not defined');
        }

        if (this.adminCommandConfig.actions === undefined ||
            !Array.isArray(this.adminCommandConfig.actions)) {
            return Promise.reject('adminCommandConfig.actions not defined');
        }

        if (!(this.adminCommandConfig.commands.length === 1 && this.adminCommandConfig.commands[0] === '*')
            && !this.adminCommandConfig.commands.includes(argv['command'])) {
            return Promise.reject('command not allowed');
        }

        if (argv['action'] !== undefined
            && !(this.adminCommandConfig.actions.length === 1 && this.adminCommandConfig.actions[0] === '*')
            && !this.adminCommandConfig.actions.includes(argv['action'])) {
            return Promise.reject('action not allowed');
        }

        return Promise.resolve(argv);
    }

    // TODO
    protected validateCommandParameters(argv: {}): Promise<{}> {
        return Promise.resolve(argv);
    }

    protected abstract processCommandArgs(argv: {}): Promise<any>;

    protected abstract getParameterConfiguration(): P;
}

