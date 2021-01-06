import {CacheInitializerCommand} from './cache-initializer.command';
import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {TourDocLoaderCommand} from './tdoc-loader.command';
import {MediaManagerCommand} from './media-manager.command';
import {TourDocExporterCommand} from './tdoc-exporter.command';
import {RedirectGeneratorCommand} from './redirect-generator.command';
import {ObjectDetectionManagerCommand} from './objectdetector.command';
import {FacetCacheManagerCommand} from './facetcache.command';
import {DbMigrateCommand} from './dbmigrate.command';
import {DbPublishCommand} from './dbPublishCommand';
import {CommonAdminCommandConfigType, CommonAdminCommandManager} from './common-admin-command.manager';

export interface AdminCommandConfigType extends CommonAdminCommandConfigType {
}

export class AdminCommandManager extends CommonAdminCommandManager<AdminCommandConfigType> {
    constructor(adminCommandConfig: AdminCommandConfigType) {
        super({
            'initCache': new CacheInitializerCommand(),
            'generateSitemap': new SiteMapGeneratorCommand(),
            'generateRedirects': new RedirectGeneratorCommand(),
            'loadTourDoc': new TourDocLoaderCommand(),
            'exportTourDoc': new TourDocExporterCommand(),
            'imageManager': new MediaManagerCommand(),
            'mediaManager': new MediaManagerCommand(),
            'objectDetectionManager': new ObjectDetectionManagerCommand(),
            'facetCacheManager': new FacetCacheManagerCommand(),
            'dbMigrate': new DbMigrateCommand(),
            'dbPublish': new DbPublishCommand()
        }, adminCommandConfig);
    }

}

