import {TourDocLoaderCommand} from './tdoc-loader.command';
import {utils} from 'js-data';
import {MediaManagerCommand} from './media-manager.command';
import {TourDocExporterCommand} from './tdoc-exporter.command';
import {ObjectDetectionManagerCommand} from './objectdetector.command';
import {DbPublishCommand} from './dbPublishCommand';
import {AdminCommandConfigType} from './admin-command.manager';
import {CommonServerAdminCommandConfigType, CommonServerAdminCommandManager} from './common-serveradmin-command.manager';
import {CommonAdminParameterConfigType} from './common-admin-command.manager';
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
    extends CommonServerAdminCommandManager<ServerAdminCommandConfigType, CommonAdminParameterConfigType> {
    protected cacheInitializer: CacheInitializerCommand;
    protected tdocLoader: TourDocLoaderCommand;
    protected tdocExporter: TourDocExporterCommand;
    protected imageManager: MediaManagerCommand;
    protected objectDetectionManager: ObjectDetectionManagerCommand;
    protected dbPublishCommand: DbPublishCommand;

    constructor(adminCommandConfig: ServerAdminCommandConfigType) {
        super(adminCommandConfig);
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        let promise: Promise<any>;
        switch (argv['command']) {
            case 'initCache':
                promise = this.cacheInitializer.process(argv);
                break;
            case 'loadTourDoc':
                promise = this.tdocLoader.process(argv);
                break;
            case 'exportTourDoc':
                promise = this.tdocExporter.process(argv);
                break;
            case 'imageManager':
                promise = this.imageManager.process(argv);
                break;
            case 'mediaManager':
                promise = this.imageManager.process(argv);
                break;
            case 'objectDetectionManager':
                promise = this.objectDetectionManager.process(argv);
                break;
            case 'dbPublish':
                promise = this.dbPublishCommand.process(argv);
                break;
            default:
                console.error('unknown command:', argv);
                promise = utils.reject('unknown command');
        }

        return promise;
    }

    protected getParameterConfiguration(): CommonAdminParameterConfigType {
        throw new Error('Method not implemented.');
    }
}

