import {CacheInitializerCommand} from './cache-initializer.command';
import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {TourDocLoaderCommand} from './tdoc-loader.command';
import {utils} from 'js-data';
import {MediaManagerCommand} from './media-manager.command';
import {TourDocExporterCommand} from './tdoc-exporter.command';
import {RedirectGeneratorCommand} from './redirect-generator.command';
import {ObjectDetectionManagerCommand} from './objectdetector.command';
import {FacetCacheManagerCommand} from './facetcache.command';
import {DbMigrateCommand} from './dbmigrate.command';
import {DbPublishCommand} from './dbPublishCommand';
import {CommonAdminCommandConfigType, CommonAdminCommandManager, CommonAdminParameterConfigType} from './common-admin-command.manager';

export interface AdminCommandConfigType extends CommonAdminCommandConfigType {
}

export interface AdminParameterConfigType extends CommonAdminParameterConfigType {
}

export class AdminCommandManager extends CommonAdminCommandManager<AdminCommandConfigType, AdminParameterConfigType> {
    protected cacheInitializer: CacheInitializerCommand;
    protected siteMapGenerator: SiteMapGeneratorCommand;
    protected tdocLoader: TourDocLoaderCommand;
    protected tdocExporter: TourDocExporterCommand;
    protected imageManager: MediaManagerCommand;
    protected redirectGenerator: RedirectGeneratorCommand;
    protected objectDetectionManager: ObjectDetectionManagerCommand;
    protected facetCacheManager: FacetCacheManagerCommand;
    protected dbMigrateCommand: DbMigrateCommand;
    protected dbPublishCommand: DbPublishCommand;

    constructor(adminCommandConfig: AdminCommandConfigType) {
        super(adminCommandConfig);
        this.cacheInitializer = new CacheInitializerCommand();
        this.siteMapGenerator = new SiteMapGeneratorCommand();
        this.tdocLoader = new TourDocLoaderCommand();
        this.tdocExporter = new TourDocExporterCommand();
        this.imageManager = new MediaManagerCommand();
        this.redirectGenerator = new RedirectGeneratorCommand();
        this.objectDetectionManager = new ObjectDetectionManagerCommand();
        this.facetCacheManager = new FacetCacheManagerCommand();
        this.dbMigrateCommand = new DbMigrateCommand();
        this.dbPublishCommand = new DbPublishCommand()
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        let promise: Promise<any>;
        switch (argv['command']) {
            case 'initCache':
                promise = this.cacheInitializer.process(argv);
                break;
            case 'generateSitemap':
                promise = this.siteMapGenerator.process(argv);
                break;
            case 'generateRedirects':
                promise = this.redirectGenerator.process(argv);
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
            case 'facetCacheManager':
                promise = this.facetCacheManager.process(argv);
                break;
            case 'dbMigrate':
                promise = this.dbMigrateCommand.process(argv);
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

    protected getParameterConfiguration(): AdminParameterConfigType {
        return undefined;
    }
}

