import minimist from 'minimist';
import {CacheInitializerCommand} from './commands/cache-initializer.command';
import {SiteMapGeneratorCommand} from './commands/sitemap-generator.command';

const argv = minimist(process.argv.slice(2));

// disable debug-logging
const debug = argv['debug'] || false;
if (!debug) {
    console.debug = function() {};
    console.log = function() {};
}

const cacheInitializer = new CacheInitializerCommand();
const siteMapGenerator = new SiteMapGeneratorCommand();

switch (argv['command']) {
    case 'initCache':
        cacheInitializer.process(argv);
        break;
    case 'generateSitemap':
        siteMapGenerator.process(argv);
        break;
    default:
        console.error('unknown command:', argv);
}
