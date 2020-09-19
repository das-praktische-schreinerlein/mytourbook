import minimist from 'minimist';
import {CacheInitializerCommand} from './commands/cache-initializer.command';
import {SiteMapGeneratorCommand} from './commands/sitemap-generator.command';
import {TourDocLoaderCommand} from './commands/tdoc-loader.command';
import {utils} from 'js-data';
import {MediaManagerCommand} from './commands/media-manager.command';
import {TourDocExporterCommand} from './commands/tdoc-exporter.command';
import {RedirectGeneratorCommand} from './commands/redirect-generator.command';
import {ObjectDetectionManagerCommand} from './commands/objectdetector.command';
import {FacetCacheManagerCommand} from './commands/facetcache.command';

const argv = minimist(process.argv.slice(2));

// disable debug-logging
const debug = argv['debug'] || false;
if (!debug) {
    console.log = function() {};
}
if (!debug || debug === false || parseInt(debug, 10) < 1) {
    console.trace = function() {};
    console.debug = function() {};
}

const cacheInitializer = new CacheInitializerCommand();
const siteMapGenerator = new SiteMapGeneratorCommand();
const tdocLoader = new TourDocLoaderCommand();
const tdocExporter = new TourDocExporterCommand();
const imageManager = new MediaManagerCommand();
const redirectGenerator = new RedirectGeneratorCommand();
const objectDetectionManager = new ObjectDetectionManagerCommand();
const facetCacheManager = new FacetCacheManagerCommand();

let promise: Promise<any>;
switch (argv['command']) {
    case 'initCache':
        promise = cacheInitializer.process(argv);
        break;
    case 'generateSitemap':
        promise = siteMapGenerator.process(argv);
        break;
    case 'generateRedirects':
        promise = redirectGenerator.process(argv);
        break;
    case 'loadTourDoc':
        promise = tdocLoader.process(argv);
        break;
    case 'exportTourDoc':
        promise = tdocExporter.process(argv);
        break;
    case 'imageManager':
        promise = imageManager.process(argv);
        break;
    case 'mediaManager':
        promise = imageManager.process(argv);
        break;
    case 'objectDetectionManager':
        promise = objectDetectionManager.process(argv);
        break;
    case 'facetCacheManager':
        promise = facetCacheManager.process(argv);
        break;
    default:
        console.error('unknown command:', argv);
        promise = utils.reject('unknown command');
}

promise.then(value => {
    console.log('DONE - command finished:', value);
    process.exit(0);
}).catch(reason => {
    console.error('ERROR - command failed:', reason);
    process.exit(-1);
});
