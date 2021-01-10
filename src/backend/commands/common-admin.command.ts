import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {
    KeywordValidationRule,
    RegExValidationReplaceRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import * as XRegExp from 'xregexp';

// TODO move to commons
export class SimpleConfigFilePathValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-_.a-zA-Z\/\\\\]*$', 'gi'),
            new XRegExp('[-_.a-zA-Z\/\\\\]*', 'gi'), '', 4096);
    }
}

// TODO move to commons
export class SimpleFilePathValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-_.a-zA-Z\/\\\\ \\p{LC}]*$', 'gi'),
            new XRegExp('[-_.a-zA-Z\/\\\\ \\p{LC}]*', 'gi'), '', 4096);
    }
}

// TODO move to commons
export abstract class CommonAdminCommand implements AbstractCommand {
    protected parameterValidations: {[key: string]: ValidationRule};
    protected availableActions: string[];

    constructor() {
        this.parameterValidations = {
            command: new KeywordValidationRule(true),
            action: new KeywordValidationRule(true),
            ...this.createValidationRules()
        };
        this.availableActions = this.definePossibleActions();
    }

    public process(argv): Promise<any> {
        const me = this;
        return this.initializeArgs(argv).then(initializedArgs => {
            return me.validateCommandParameters(initializedArgs);
        }).then(validatedArgs => {
            return me.processCommandArgs(validatedArgs);
        });
    }

    public listCommandParameters(): string[] {
        return Object.keys(this.parameterValidations);
    }

    public validateCommandAction(action: string): Promise<{}> {
        return this.availableActions.includes(action)
            ? Promise.resolve(action)
            : Promise.reject('action not defined');
    };

    public validateCommandParameters(argv: {}): Promise<{}> {
        const errors = [];
        for (const key of Object.keys(this.parameterValidations)) {
            if (!this.parameterValidations[key].isValid(argv[key])) {
                errors.push(key);
            }
        }

        return errors.length > 0
            ? Promise.reject('invalid parameters: ' + errors)
            : Promise.resolve(argv);
    };

    protected initializeArgs(argv: {}): Promise<{}> {
        const initializedArgs = {};
        for (const key in argv) {
            if (!argv.hasOwnProperty(key)) {
                continue;
            }

            if (!this.parameterValidations.hasOwnProperty(key)) {
                console.log('SKIP parameter - ignore parameter as it is not defined for validation', key);
                continue;
            }

            initializedArgs[key] = argv[key];
        }

        return Promise.resolve(initializedArgs);
    }

    protected abstract processCommandArgs(argv: {}): Promise<any>;
    protected abstract createValidationRules(): {[key: string]: ValidationRule};
    protected abstract definePossibleActions(): string[];
}

