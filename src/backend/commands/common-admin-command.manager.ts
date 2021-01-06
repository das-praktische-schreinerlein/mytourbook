import {CommonAdminCommand} from './common-admin.command';

// TODO move to commons
export interface CommonAdminParameterConfigType {
    parameters: {[key: string]: string};
}

// TODO move to commons
export interface CommonAdminCommandConfigType {
    adminWritable: boolean;
    availableCommands: {[key: string]: string[]};
    preparedCommands: {[key: string]: CommonAdminParameterConfigType};
    constantParameters: {[key: string]: string};
}

// TODO move to commons
export interface CommonAdminCommandsRequestType {
    command: CommonAdminCommand;
    parameters: {[key: string]: string};
}

// TODO move to commons
export abstract class CommonAdminCommandManager<A extends CommonAdminCommandConfigType, P extends CommonAdminParameterConfigType> {
    protected commands: {[key: string]: CommonAdminCommand};
    protected adminCommandConfig: A;

    constructor(commands: {[key: string]: CommonAdminCommand}, adminCommandConfig: A) {
        this.commands = commands;
        this.adminCommandConfig = adminCommandConfig;
    }

    public process(argv): Promise<any> {
        const me = this;
        return this.initializeArgs(argv).then(initializedArgs => {
            if (initializedArgs['preparedCommand']) {
                return me.initializePreparedCommand(initializedArgs);
            }

            return me.initializeCommand(initializedArgs);
        }).then(commandRequest => {
            return me.validateCommandParameters(commandRequest);
        }).then(commandRequest => {
            return me.processCommandArgs(commandRequest);
        });
    }

    protected initializeArgs(argv: {}): Promise<{}> {
        const initializedArgs = {...argv};
        for (const key in this.adminCommandConfig.constantParameters) {
            if (!this.adminCommandConfig.constantParameters.hasOwnProperty(key)) {
                continue;
            }

            initializedArgs[key] = this.adminCommandConfig.constantParameters[key];
        }

        return Promise.resolve(initializedArgs);
    }

    protected initializePreparedCommand(argv: {}): Promise<CommonAdminCommandsRequestType> {
        const preparedCommandName = argv['preparedCommand'];
        if (preparedCommandName === undefined) {
            return Promise.reject('preparedCommand not defined');
        }

        if (this.adminCommandConfig === undefined || this.adminCommandConfig.adminWritable !== true) {
            return Promise.reject('adminCommandConfig.adminWritable not active');
        }

        if (this.commands === undefined || Object.keys(this.commands).length < 1) {
            return Promise.reject('no commands defined');
        }

        if (this.adminCommandConfig.preparedCommands === undefined
            || Object.keys(this.adminCommandConfig.preparedCommands).length < 1) {
            return Promise.reject('adminCommandConfig.preparedCommands not defined');
        }

        const preparedCommand = this.adminCommandConfig.preparedCommands[preparedCommandName];
        if (preparedCommand === undefined) {
            return Promise.reject('preparedCommand not found');
        }

        const initializedArgs = {};
        for (const key in preparedCommand.parameters) {
            if (!preparedCommand.parameters.hasOwnProperty(key)) {
                continue;
            }

            initializedArgs[key] = preparedCommand.parameters[key];
        }

        const requestedCommand = initializedArgs['command'];
        if (this.commands[requestedCommand] === undefined) {
            return Promise.reject('command not defined');
        }

        return Promise.resolve({
            command: this.commands[requestedCommand],
            parameters: initializedArgs
        });
    }

    protected initializeCommand(argv: {}): Promise<CommonAdminCommandsRequestType> {
        if (this.adminCommandConfig === undefined || this.adminCommandConfig.adminWritable !== true) {
            return Promise.reject('adminCommandConfig.adminWritable not active');
        }

        if (this.adminCommandConfig.availableCommands === undefined
            || Object.keys(this.adminCommandConfig.availableCommands).length < 1) {
            return Promise.reject('adminCommandConfig.commands not defined');
        }

        if (this.commands === undefined || Object.keys(this.commands).length < 1) {
            return Promise.reject('no commands defined');
        }

        let availableCommandActions;
        const requestedCommand = argv['command'];
        if (Object.keys(this.adminCommandConfig.availableCommands).length === 1
            && this.adminCommandConfig.availableCommands['*'] !== undefined) {
            availableCommandActions = this.adminCommandConfig.availableCommands['*'];
        } else if (this.adminCommandConfig.availableCommands[requestedCommand] !== undefined) {
            availableCommandActions = this.adminCommandConfig.availableCommands[requestedCommand];
        } else {
            return Promise.reject('command not allowed');
        }

        const requestedAction = argv['action'];
        if (requestedAction !== undefined
            && !(availableCommandActions.length === 1 && availableCommandActions[0] === '*')
            && !availableCommandActions.includes(requestedAction)) {
            return Promise.reject('action not allowed');
        }

        if (this.commands[requestedCommand] === undefined) {
            return Promise.reject('command not defined');
        }

        return Promise.resolve({
            command: this.commands[requestedCommand],
            parameters: argv
        });
    }

    protected validateCommandParameters(commandRequest: CommonAdminCommandsRequestType): Promise<CommonAdminCommandsRequestType> {
        return commandRequest.command.validateCommandParameters(commandRequest.parameters).then(() => {
            return Promise.resolve(commandRequest);
        });
    }

    protected processCommandArgs(commandRequest: CommonAdminCommandsRequestType): Promise<any> {
        return commandRequest.command.process(commandRequest.parameters);
    }
}

