import LatLng = L.LatLng;

export enum GeoElementType {
    TRACK,
    ROUTE,
    WAYPOINT
}

export class GeoElement {
    type: GeoElementType;
    points: LatLng[] = [];
    name: string;

    constructor(type: GeoElementType, points: L.LatLng[], name: string) {
        this.type = type;
        this.points = points;
        this.name = name;
    }
}

export class GpxParser  {
    parseGpx(xml: string, options): GeoElement[] {
        if (!xml || !xml.startsWith('<?xml')) {
            return;
        }

        const oParser = new DOMParser();
        const gpxDom = oParser.parseFromString(xml, 'text/xml');
        if (gpxDom.documentElement.nodeName === 'parsererror') {
            return;
        }

        const elements = this._parseGpxDom(gpxDom, options);
        if (!elements) {
            return;
        }

        return elements;
    }

    _parseGpxDom(gpxDom, options): GeoElement[] {
        let j, i, el = [];
        let named = false;
        const elements = [], tags = [['rte', 'rtept'], ['trkseg', 'trkpt']];

        for (j = 0; j < tags.length; j++) {
            el = gpxDom.getElementsByTagName(tags[j][0]);
            for (i = 0; i < el.length; i++) {
                const l = this.parse_trkseg(el[i], gpxDom, tags[j][1]);
                if (this.parse_name(el[i], l)) {
                    named = true;
                }
                elements.push(l);
            }
        }

        el = gpxDom.getElementsByTagName('wpt');
        if (options.display_wpt !== false) {
            for (i = 0; i < el.length; i++) {
                const waypoint = this.parse_wpt(el[i], gpxDom);
                if (!waypoint) {
                    continue;
                }
                if (this.parse_name(el[i], waypoint)) {
                    named = true;
                }
                elements.push(waypoint);
            }
        }

        if (!elements.length) {
            return;
        }
        return elements;
    }

    parse_name(gpxDom, layer: GeoElement): string {
        let i, el, txt = '', name, descr = '', link, len = 0;
        el = gpxDom.getElementsByTagName('name');
        if (el.length) {
            name = el[0].childNodes[0].nodeValue;
        }
        el = gpxDom.getElementsByTagName('desc');
        for (i = 0; i < el.length; i++) {
            for (let j = 0; j < el[i].childNodes.length; j++) {
                descr = descr + el[i].childNodes[j].nodeValue;
            }
        }
        el = gpxDom.getElementsByTagName('link');
        if (el.length) {
            link = el[0].getAttribute('href');
        }

        len = this._polylineLen(layer.points);

        if (name) {
            txt += '<h2>' + name + '</h2>' + descr;
        }
        if (len) {
            txt += '<p>' + this._humanLen(len) + '</p>';
        }
        if (link) {
            txt += '<p><a target="_blank" href="' + link + '">[...]</a></p>';
        }

        layer.name = txt;

        return txt;
    }

    parse_trkseg(line, gpxDom, tag): GeoElement {
        const el = line.getElementsByTagName(tag);
        if (!el.length) {
            return;
        }
        const coords = [];
        for (let i = 0; i < el.length; i++) {
            const ptElement = el[i];
            const eleElement = ptElement.getElementsByTagName('ele');
            let ele;
            if (eleElement && eleElement.length > 0) {
                ele = eleElement[0].childNodes[0].nodeValue;
            }
            const ll = ele !== undefined ?
                new L.LatLng(ptElement.getAttribute('lat'), ptElement.getAttribute('lon'), ele) :
                new L.LatLng(ptElement.getAttribute('lat'), ptElement.getAttribute('lon'));
            coords.push(ll);
        }
        return new GeoElement(tag === 'trkpt' ? GeoElementType.TRACK : GeoElementType.ROUTE, coords, name);
    }

    parse_wpt(e, gpxDom): GeoElement {
        const m = new GeoElement(GeoElementType.WAYPOINT, [new L.LatLng(e.getAttribute('lat'), e.getAttribute('lon'))], undefined);
        return m;
    }

    _humanLen(l) {
        if (l < 2000) {
            return l.toFixed(0) + ' m';
        } else {
            return (l / 1000).toFixed(1) + ' km';
        }
    }

    _polylineLen(ll: LatLng[]) {
        let d = 0, p = null;
        for (let i = 0; i < ll.length; i++) {
            if (i && p) {
                d += p.distanceTo(ll[i]);
            }
            p = ll[i];
        }
        return d;
    }
}
