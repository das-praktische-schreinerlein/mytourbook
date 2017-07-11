// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    solrCoreSDoc: 'http://localhost:8983/solr/mytb/',
    solrCoreSDocReadUsername: 'mytbread',
    solrCoreSDocReadPassword: 'SolrRocks',
    backendApiBaseUrl: 'http://localhost:4100/api/v1/',
    tracksBaseUrl: 'http://localhost:4100/tracks/',
    picsBaseUrl: 'http://localhost/michas//digifotos/'
};
