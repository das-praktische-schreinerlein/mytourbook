import * as L from 'leaflet';
import {GeoElement, GeoElementType, GeoParser} from './geo.parser';

export class GeoGpxParser extends GeoParser {
    parse(xml: string, options): GeoElement[] {
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
        const elements = [], tags = [['rte', 'rtept'], ['trkseg', 'trkpt']];

        for (j = 0; j < tags.length; j++) {
            el = gpxDom.getElementsByTagName(tags[j][0]);
            for (i = 0; i < el.length; i++) {
                const l = this.parse_trkseg(el[i], gpxDom, tags[j][1]);
                if (!l) {
                    continue;
                }
                if (options.generateName) {
                    this.parse_name(el[i], l);
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
                if (options.generateName) {
                    this.parse_name(el[i], waypoint);
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

        len = layer !== undefined ? this._polylineLen(layer.points) : undefined;

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
}
