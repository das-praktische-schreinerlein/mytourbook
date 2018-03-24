import {AbstractCommand} from './abstract.command';
import * as fs from 'fs';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {utils} from 'js-data';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {GenericSearchResult} from '../shared/search-commons/model/container/generic-searchresult';

export class SDocExporterCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const perRun = 999;
        const typeOrder = ['location', 'news', 'trip', 'route', 'track', 'image'];

        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const serverConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
            readOnly: false
        };

        const dataFileName = argv['f'] || argv['file'];
        if (dataFileName === undefined) {
            console.error('option --file expected');
            return;
        }
        const dataService: SDocDataService = SDocDataServiceModule.getDataService('sdocSolr', serverConfig.backendConfig);
        dataService.setWritable(false);
        const responseMapper = new SDocAdapterResponseMapper(serverConfig.backendConfig);

        fs.writeFileSync(dataFileName, '{"sdocs": [');
        let first = true;

        const replacer = function(key, value) {
            if (value === null) {
                return undefined;
            }

            return value;
        };


        const exportSearchResultToJson = function(searchForm: SDocSearchForm): Promise<any> {
            return dataService.search(searchForm).then(
                function searchDone(searchResult: GenericSearchResult<SDocRecord, SDocSearchForm>) {
                    let output = '';
                    for (const doc of searchResult.currentRecords) {
                        output += (first ? '\n  ' : ',\n  ') + JSON.stringify(responseMapper.mapToAdapterDocument({}, doc), replacer);
                        first = false;
                    }
                    fs.appendFileSync(dataFileName, output);

                    console.log('DONE ' + searchForm.pageNum + ' from ' + (searchResult.recordCount / searchForm.perPage + 1)
                        + ' for: ' + searchResult.recordCount, searchForm);
                    searchForm.pageNum++;
                    if (searchForm.pageNum < (searchResult.recordCount / searchForm.perPage + 1)) {
                        return exportSearchResultToJson(searchForm);
                    } else {
                        return utils.resolve(dataFileName);
                    }
                }
            ).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return utils.reject(error);
            });
        };

        const exportTypeToJson = function(types: string[], nr: number): Promise<any> {
            if (nr >= types.length) {
                fs.appendFileSync(dataFileName, ']}');
                return utils.resolve('DONE');
            }

            const globSearchForm = new SDocSearchForm({});
            globSearchForm.perPage = perRun;
            globSearchForm.pageNum = 1;
            globSearchForm.type = types[nr];

            console.log('DO export ' + nr, globSearchForm);
            return exportSearchResultToJson(globSearchForm).then(value => {
                return exportTypeToJson(types, nr + 1);
            }).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return utils.reject(error);
            });
        };

        return exportTypeToJson(typeOrder, 0);
    }
}
