import minimist from 'minimist';
import {CacheInitializerCommand} from './commands/cache-initializer.command';
import {SiteMapGeneratorCommand} from './commands/sitemap-generator.command';
import {TourDocLoaderCommand} from './commands/tdoc-loader.command';
import {utils} from 'js-data';
import {MediaManagerCommand} from './commands/media-manager.command';
import {TourDocExporterCommand} from './commands/tdoc-exporter.command';
import {RedirectGeneratorCommand} from './commands/redirect-generator.command';

const argv = minimist(process.argv.slice(2));

// disable debug-logging
const debug = argv['debug'] || false;
if (!debug) {
    console.trace = function() {};
    console.debug = function() {};
    console.log = function() {};
}

const cacheInitializer = new CacheInitializerCommand();
const siteMapGenerator = new SiteMapGeneratorCommand();
const tdocLoader = new TourDocLoaderCommand();
const tdocExporter = new TourDocExporterCommand();
const imageManager = new MediaManagerCommand();
const redirectGenerator = new RedirectGeneratorCommand();

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
    default:
        console.error('unknown command:', argv);
        promise = utils.reject('unknown command');
}

promise.then(value => {
    process.exit(0);
}).catch(reason => {
    process.exit(-1);
});
