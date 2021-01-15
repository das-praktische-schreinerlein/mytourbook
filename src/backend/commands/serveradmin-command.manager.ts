import {MediaManagerCommand} from './media-manager.command';
import {ObjectDetectionManagerCommand} from './objectdetector.command';
import {DbPublishCommand} from './dbpublish.command';
import {AdminCommandConfigType} from './admin-command.manager';
import {CommonServerAdminCommandConfigType, CommonServerAdminCommandManager} from './common-serveradmin-command.manager';
import {CacheInitializerCommand} from './cache-initializer.command';
import {SolrPublishCommand} from './solrpublish.command';

export interface ServerAdminCommandConfigType extends CommonServerAdminCommandConfigType, AdminCommandConfigType {
    importDir: string,
    exportDir: string,
    exportName: string,
    outputDir: string,
    outputFile: string,
    publishConfigFile: string,
}

export class ServerAdminCommandManager extends CommonServerAdminCommandManager<ServerAdminCommandConfigType> {

    constructor(adminCommandConfig: ServerAdminCommandConfigType) {
        // only define a subset of commands
        super({
                'initCache': new CacheInitializerCommand(),
                'mediaManager': new MediaManagerCommand(),
                'objectDetectionManager': new ObjectDetectionManagerCommand(),
                'dbPublish': new DbPublishCommand(),
                'solrPublish': new SolrPublishCommand()
            },
            adminCommandConfig,
            // only allow a subset of actions
            ['initCache', 'sendQueueRequests', 'sendImageQueueRequests', 'sendVideoQueueRequests',
                'readImageDates', 'scaleImages', 'publishDB', 'publishSolr']);
    }

    protected initializeArgs(argv: {}): Promise<{}> {
        return super.initializeArgs(argv).then(initializedArgs => {
            // set configured parameter constants
            initializedArgs['backend'] = this.adminCommandConfig.backend;
            initializedArgs['publishConfigFile'] = this.adminCommandConfig.publishConfigFile;

            initializedArgs['importDir'] = this.adminCommandConfig.importDir;
            initializedArgs['exportDir'] = this.adminCommandConfig.exportDir;
            initializedArgs['exportName'] = this.adminCommandConfig.exportName;
            initializedArgs['outputDir'] = this.adminCommandConfig.outputDir;
            initializedArgs['outputFile'] = this.adminCommandConfig.outputFile;

            initializedArgs['srcBaseUrl'] = this.adminCommandConfig.srcBaseUrl;
            initializedArgs['destBaseUrl'] = this.adminCommandConfig.destBaseUrl;

            // reset dangerous parameters
            initializedArgs['srcFile'] = undefined;
            initializedArgs['sitemap'] = undefined;
            initializedArgs['file'] = undefined;

            // TODO check and reset

            return Promise.resolve(initializedArgs);
        })
    }

}
