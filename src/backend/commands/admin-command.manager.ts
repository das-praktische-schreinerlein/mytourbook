import {CacheInitializerCommand} from './cache-initializer.command';
import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {TourDocLoaderCommand} from './tdoc-loader.command';
import {MediaManagerCommand} from './media-manager.command';
import {TourDocExporterCommand} from './tdoc-exporter.command';
import {RedirectGeneratorCommand} from './redirect-generator.command';
import {ObjectDetectionManagerCommand} from './objectdetector.command';
import {FacetCacheManagerCommand} from './facetcache.command';
import {DbMigrateCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/dbmigrate.command';
import {DbPublishCommand} from './dbpublish.command';
import {
    CommonAdminCommandConfigType,
    CommonAdminCommandManager
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin-command.manager';
import {SolrPublishCommand} from './solrpublish.command';
import {ExtendedConfigInitializerCommand} from './extendedconfig-initializer.command';
import {DbAdminCommand} from './dbadmin.command';
import {MediaImportManagerCommand} from './media-import-manager.command';

// tslint:disable-next-line:no-empty-interface
export interface AdminCommandConfigType extends CommonAdminCommandConfigType {
}

export class AdminCommandManager extends CommonAdminCommandManager<AdminCommandConfigType> {
    constructor(adminCommandConfig: AdminCommandConfigType) {
        super({
            'initCache': new CacheInitializerCommand(),
            'initConfig': new ExtendedConfigInitializerCommand(),
            'generateSitemap': new SiteMapGeneratorCommand(),
            'generateRedirects': new RedirectGeneratorCommand(),
            'loadTourDoc': new TourDocLoaderCommand(),
            'exportTourDoc': new TourDocExporterCommand(),
            'mediaManager': new MediaManagerCommand(),
            'mediaImportManager': new MediaImportManagerCommand(),
            'objectDetectionManager': new ObjectDetectionManagerCommand(),
            'facetCacheManager': new FacetCacheManagerCommand(),
            'dbAdmin': new DbAdminCommand(),
            'dbMigrate': new DbMigrateCommand(),
            'dbPublish': new DbPublishCommand(),
            'solrPublish': new SolrPublishCommand()
        }, adminCommandConfig);
    }

}

