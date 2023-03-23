import * as fs from 'fs';
import {
    NameValidationRule,
    SimpleConfigFilePathValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {
    AbstractWebRequestCommand,
    SingleWebRequestConfigType,
    WebRequestCommandOptions
} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract-webcall.command';

export interface SolrPublishCommandOptions extends WebRequestCommandOptions {
    profile: string,
    target: string
    knexConfig: {
        client: string;
        connection: {},
        solr: {
            core: string,
            username: string,
            password: string
        }
    }
}

export class SolrPublishCommand extends AbstractWebRequestCommand<SolrPublishCommandOptions> {
    protected static TARGETS = ['mytbexportbetadb', 'mytbexportproddb'];
    protected static PROFILES = ['sqlite', 'mysql'];

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            publishConfigFile: new SimpleConfigFilePathValidationRule(true),
            profile: new NameValidationRule(true),
            target: new NameValidationRule(true)
        };
    }

    protected definePossibleActions(): string[] {
        return ['publishSolr'];
    }

    protected configureTargetProfile(target: string, profile: string): string {
        switch (target) {
            case 'mytbexportbetadb':
                return 'mytbexportbetadb_' + profile;
            case 'mytbexportproddb':
                return 'mytbexportproddb_' + profile;
            default:
                return undefined;
        }
    }

    protected configureWebRequestCommandOptions(argv: {}): Promise<SolrPublishCommandOptions> {
        const profile = argv['profile'];
        if (profile === undefined || (!SolrPublishCommand.PROFILES.includes(profile))) {
            return Promise.reject('ERROR - parameters required profile: "--profile ' + SolrPublishCommand.PROFILES + '"');
        }

        const target = argv['target'];
        if (target === undefined || (!SolrPublishCommand.TARGETS.includes(target))) {
            return Promise.reject('ERROR - parameters required target: "--target ' + SolrPublishCommand.TARGETS + '"');
        }

        const publishConfigFile = argv['publishConfigFile'];
        if (publishConfigFile === undefined || !fs.existsSync(publishConfigFile) || !fs.lstatSync(publishConfigFile).isFile()) {
            return Promise.reject('ERROR - parameters required publishConfigFile: "--publishConfigFile"');
        }

        const publishConfig = JSON.parse(fs.readFileSync(publishConfigFile, { encoding: 'utf8' }));
        const targetProfile = this.configureTargetProfile(target, profile);
        if (publishConfig === undefined || !publishConfig['environments'] || !publishConfig['environments'][targetProfile]) {
            return Promise.reject('ERROR - invalid publishConfigFile: "' + publishConfigFile + '"' +
                ' or targetProfile: "' + targetProfile + '"');
        }

        const knexConfig = publishConfig['environments'][targetProfile];
        const options: SolrPublishCommandOptions = {
            profile: profile,
            target: target,
            knexConfig: knexConfig
        }

        return Promise.resolve(options);
    }

    protected configureRequests(webRequestCommandOptions: SolrPublishCommandOptions, webRequests: SingleWebRequestConfigType[])
        : Promise<SolrPublishCommandOptions> {
        let endpoint: string
        switch (webRequestCommandOptions.knexConfig.client) {
            case 'mysql':
                endpoint = 'dataimportmysql';
                break;
            case 'sqlite3':
                endpoint = 'dataimportsqlite';
                break;
            default:
                return Promise.reject('ERROR - unknown target: "' + webRequestCommandOptions.target + '"');
        }

        webRequests.push({
            method: 'GET',
            auth: {
                username: webRequestCommandOptions.knexConfig.solr.username,
                password: webRequestCommandOptions.knexConfig.solr.password
            },
            url: webRequestCommandOptions.knexConfig.solr.core +
                endpoint +
                '?command=full-import&clean=true&commit=true&optimize=true&synchronous=true&verbose=true',
        });

        return Promise.resolve(webRequestCommandOptions);
    }
}
