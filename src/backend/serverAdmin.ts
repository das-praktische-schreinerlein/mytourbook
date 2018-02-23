import minimist from 'minimist';
import {CacheInitializerCommand} from './commands/cache-initializer.command';
import {SiteMapGeneratorCommand} from './commands/sitemap-generator.command';
import {SDocLoaderCommand} from './commands/sdoc-loader.command';
import {utils} from 'js-data';
import {ImageManagerCommand} from './commands/image-manager.command';

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
const sdocLoader = new SDocLoaderCommand();
const imageManager = new ImageManagerCommand();

let promise: Promise<any>;
switch (argv['command']) {
    case 'initCache':
        promise = cacheInitializer.process(argv);
        break;
    case 'generateSitemap':
        promise = siteMapGenerator.process(argv);
        break;
    case 'loadSdoc':
        promise = sdocLoader.process(argv);
        break;
    case 'imageManager':
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
