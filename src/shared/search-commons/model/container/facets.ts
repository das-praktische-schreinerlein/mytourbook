export class Facet {
    public facet: Array<Array<any>> = [];
    public selectLimit?: number;
}

export class Facets {
    public facets: Map<string, Facet> = new Map<string, Facet>();
}
