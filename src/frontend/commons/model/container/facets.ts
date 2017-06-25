export class Facet {
    public facet: Array<Array<any>> = [];
}

export class Facets {
    public facets: Map<string, Facet> = new Map<string, Facet>();
}
