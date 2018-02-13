import {AdapterFilterActions, AdapterOpts, AdapterQuery, MapperUtils} from './mapper.utils';
import {utils} from 'js-data';

export interface SolrQueryData {
    start: number;
    rows: number;
    sort?: string[];
    field?: string[];
    q: string;
    fl?: string;
}

export interface SolrConfig {
    fieldList: string[];
    facetConfigs: {};
    filterMapping: {};
    fieldMapping: {};
    sortMapping: {};
    commonSortOptions: {};
    spatialField?: string;
    spatialSortKey?: string;
}

export class SolrQueryBuilder {
    protected mapperUtils = new MapperUtils();

    public buildUrl(url, params) {
        if (!params) {
            return url;
        }

        const parts = [];

        utils.forOwn(params, function (val, key) {
            if (val === null || typeof val === 'undefined') {
                return;
            }
            if (!utils.isArray(val)) {
                val = [val];
            }

            val.forEach(function (v) {
                if (typeof window !== 'undefined' && window.toString.call(v) === '[object Date]') {
                    v = v.toISOString().trim();
                } else if (utils.isObject(v)) {
                    v = utils.toJson(v).trim();
                }
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
            });
        });

        if (parts.length > 0) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
        }

        // console.error("url:" + url, params);

        return url;
    }

    public queryTransformToAdapterSelectQuery(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery,
                                        adapterOpts: AdapterOpts): SolrQueryData {

        const query = this.createAdapterSelectQuery(solrConfig, method, adapterQuery, adapterOpts);

        const fields = this.getAdapterSelectFields(solrConfig, method, adapterQuery);
        if (fields !== undefined && fields.length > 0) {
            query.fl = fields.join(' ');
        }

        const facetParams = this.getFacetParams(solrConfig, adapterOpts);
        if (facetParams !== undefined && facetParams.size > 0) {
            facetParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        const spatialParams = this.getSpatialParams(solrConfig, adapterQuery);
        if (spatialParams !== undefined && spatialParams.size > 0) {
            spatialParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        const sortParams = this.getSortParams(solrConfig, method, adapterQuery, adapterOpts);
        if (sortParams !== undefined && sortParams.size > 0) {
            sortParams.forEach(function (value, key) {
                query[key] = value;
            });
        }

        // console.error('solQuery:', query);

        return query;
    }

    public isSpatialQuery(solrConfig: SolrConfig, adapterQuery: AdapterQuery): boolean {
        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined && solrConfig.spatialField !== undefined) {
            return true;
        }

        return false;
    };

    protected createAdapterSelectQuery(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery,
                                       adapterOpts: AdapterOpts): SolrQueryData {
        // console.log('createAdapterSelectQuery adapterQuery:', adapterQuery);
        // console.log('createAdapterSelectQuery adapterOpts:', adapterOpts);

        const newParams = [];
        if (adapterQuery.where) {
            for (const fieldName of Object.getOwnPropertyNames(adapterQuery.where)) {
                const filter = adapterQuery.where[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = adapterQuery.where[fieldName][action];
                newParams.push(this.mapFilterToAdapterQuery(solrConfig, fieldName, action, value));
            }
        }
        if (adapterQuery.additionalWhere) {
            for (const fieldName of Object.getOwnPropertyNames(adapterQuery.additionalWhere)) {
                const filter = adapterQuery.additionalWhere[fieldName];
                const action = Object.getOwnPropertyNames(filter)[0];
                const value = adapterQuery.additionalWhere[fieldName][action];
                newParams.push(this.mapFilterToAdapterQuery(solrConfig, fieldName, action, value));
            }
        }

        const query: SolrQueryData = {
            q: '*:*',
            start: adapterOpts.offset * adapterOpts.limit,
            rows: adapterOpts.limit};
        if (newParams.length > 0) {
            query.q = '(' + newParams.join(' AND ') + ')';
        }

        // console.log('createAdapterSelectQuery result:', query);
        return query;
    }

    protected getSortParams(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery,
                            adapterOpts: AdapterOpts): Map<string, any> {
        const form = adapterOpts.originalSearchForm;
        const sortMapping = solrConfig.sortMapping;
        const sortParams = new Map<string, any>();
        let sortKey: string;
        if (form && form.sort) {
            sortKey = form.sort;
        }
        // ignore distance-sort if not spatial-search
        if (!this.isSpatialQuery(solrConfig, adapterQuery) && solrConfig.spatialField !== undefined &&
            solrConfig.spatialSortKey === sortKey) {
            sortKey = 'relevance';
        }
        if (sortKey === undefined || sortKey.length < 1)  {
            sortKey = 'relevance';
        }

        for (const key in solrConfig.commonSortOptions) {
            sortParams.set(key, solrConfig.commonSortOptions[key]);
        }

        if (sortMapping.hasOwnProperty(sortKey)) {
            for (const key in sortMapping[sortKey]) {
                sortParams.set(key, sortMapping[sortKey][key]);
            }
        }

        return sortParams;
    };

    protected getSpatialParams(solrConfig: SolrConfig, adapterQuery: AdapterQuery): Map<string, any> {
        const spatialParams = new Map<string, any>();

        if (this.isSpatialQuery(solrConfig, adapterQuery)) {
            const [lat, lon, distance] = adapterQuery.spatial.geo_loc_p.nearby.split(/_/);

            spatialParams.set('fq', '{!geofilt cache=false}');
            spatialParams.set('sfield', solrConfig.spatialField);
            spatialParams.set('pt', lat + ',' + lon);
            spatialParams.set('d', distance);
        }

        return spatialParams;
    };

    protected getAdapterSelectFields(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery): string[] {
        const fields = solrConfig.fieldList.slice(0);

        if (adapterQuery !== undefined && adapterQuery.spatial !== undefined && adapterQuery.spatial.geo_loc_p !== undefined &&
            adapterQuery.spatial.geo_loc_p.nearby !== undefined) {
            fields.push('distance:geodist()');
        }
        if (adapterQuery.loadTrack === true) {
            fields.push('gpstrack_src_s');
        }

        return fields;
    }

    protected getFacetParams(solrConfig: SolrConfig, adapterOpts: AdapterOpts): Map<string, any> {
        const facetConfigs = solrConfig.facetConfigs;

        const facetParams = new Map<string, any>();
        const facets = [];
        for (const key in facetConfigs) {
            if (adapterOpts.showFacets === true || (adapterOpts.showFacets instanceof Array && adapterOpts.showFacets.indexOf(key) >= 0)) {
                facets.push(key);
                for (const paramKey in facetConfigs[key]) {
                    facetParams.set(paramKey, facetConfigs[key][paramKey]);
                }
            }
        }

        if (facets.length > 0) {
            facetParams.set('facet', 'on');
            facetParams.set('facet.field', facets);
        }

        return facetParams;
    };

    protected mapToAdapterFieldName(solrConfig: SolrConfig, fieldName: string): string {
        switch (fieldName) {
            default:
                break;
        }

        return this.mapperUtils.mapToAdapterFieldName(solrConfig.fieldMapping, fieldName);
    }

    protected mapFilterToAdapterQuery(solrConfig: SolrConfig, fieldName: string, action: string, value: any): string {
        let realFieldName = undefined;

        if (solrConfig.facetConfigs.hasOwnProperty(fieldName)) {
            if (solrConfig.facetConfigs[fieldName].noFacet === true) {
                return undefined;
            }

            realFieldName = solrConfig.facetConfigs[fieldName].selectField || solrConfig.facetConfigs[fieldName].filterField;
            action = solrConfig.facetConfigs[fieldName].action || action;
        }
        if (realFieldName === undefined && solrConfig.filterMapping.hasOwnProperty(fieldName)) {
            realFieldName = solrConfig.filterMapping[fieldName];
        }
        if (realFieldName === undefined) {
            realFieldName = this.mapToAdapterFieldName(solrConfig, fieldName);
        }


        return this.generateFilter(realFieldName, action, value);
    }

    protected generateFilter(fieldName: string, action: string, value: any): string {
        let query = '';

        if (action === AdapterFilterActions.LIKEI || action === AdapterFilterActions.LIKE) {
            query = fieldName + ':("' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '" AND "') + '")';
        } else if (action === AdapterFilterActions.EQ1 || action === AdapterFilterActions.EQ2) {
            query = fieldName + ':("' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '")';
        } else if (action === AdapterFilterActions.GT) {
            query = fieldName + ':{"' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '" TO *}';
        } else if (action === AdapterFilterActions.GE) {
            query = fieldName + ':["' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '" TO *]';
        } else if (action === AdapterFilterActions.LT) {
            query = fieldName + ':{ * TO "' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"}';
        } else if (action === AdapterFilterActions.LE) {
            query = fieldName + ':[ * TO "' + this.mapperUtils.prepareEscapedSingleValue(value, ' ', '') + '"]';
        } else if (action === AdapterFilterActions.IN || action === AdapterFilterActions.IN_NUMBER) {
            query = fieldName + ':("' + value.map(
                inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
            ).join('" OR "') + '")';
        } else if (action === AdapterFilterActions.NOTIN) {
            query = fieldName + ':(-"' + value.map(
                inValue => this.mapperUtils.escapeAdapterValue(inValue.toString())
            ).join('" AND -"') + '")';
        }

        return query;
    }
}

