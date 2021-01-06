import {TourDocLoaderCommand} from './tdoc-loader.command';
import {MediaManagerCommand} from './media-manager.command';
import {TourDocExporterCommand} from './tdoc-exporter.command';
import {ObjectDetectionManagerCommand} from './objectdetector.command';
import {DbPublishCommand} from './dbPublishCommand';
import {AdminCommandConfigType} from './admin-command.manager';
import {CommonServerAdminCommandConfigType, CommonServerAdminCommandManager} from './common-serveradmin-command.manager';
import {CacheInitializerCommand} from './cache-initializer.command';

export interface ServerAdminCommandConfigType extends CommonServerAdminCommandConfigType, AdminCommandConfigType {
    importDir: string,
    exportDir: string,
    exportName: string,
    outputDir: string,
    outputFile: string,
    publishConfigFile: string,
}

export class ServerAdminCommandManager
    extends CommonServerAdminCommandManager<ServerAdminCommandConfigType> {

    constructor(adminCommandConfig: ServerAdminCommandConfigType) {
        // only define a subset of commands
        super({
                'initCache': new CacheInitializerCommand(),
                'loadTourDoc': new TourDocLoaderCommand(),
                'exportTourDoc': new TourDocExporterCommand(),
                'imageManager': new MediaManagerCommand(),
                'mediaManager': new MediaManagerCommand(),
                'objectDetectionManager': new ObjectDetectionManagerCommand(),
                'dbPublish': new DbPublishCommand()
            },
            adminCommandConfig,
            // only allow a subset of actions
            ['sendQueueRequests', 'sendImageQueueRequests', 'sendVideoQueueRequests',
                'readImageDates', 'scaleImages']);
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

