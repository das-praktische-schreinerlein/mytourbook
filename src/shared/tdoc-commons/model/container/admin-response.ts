// TODO move to commons

export enum CommonAdminCommandState {
    UNKNOWN = 'UNKNOWN', RUNNING = 'RUNNING', AVAILABLE = 'AVAILABLE'
}

export enum CommonAdminCommandResultState {
    UNKNOWN = 'UNKNOWN', RUNNING = 'RUNNING', DONE = 'DONE', ERROR = 'ERROR'
}

export interface CommonAdminCommandStateType {
    command: string,
    state: CommonAdminCommandState,
    resultState: CommonAdminCommandResultState;
    resultMsg: string,
    started: Date,
    ended: Date,
    log?: string
}

export interface CommonAdminCommandsListResponseType {
    command: string;
    actions?: string[];
    parameters?: string[];
    description?: string;
}

export enum CommonAdminResponseResultState {
    DONE = 'DONE', ERROR = 'ERROR'
}

export interface CommonAdminResponseType {
    resultState: CommonAdminResponseResultState,
    resultMsg: string,
    resultDate: Date,
    preparedCommands: {[key: string]: CommonAdminCommandsListResponseType},
    commandsStates?: {[key: string]: CommonAdminCommandStateType},
}
