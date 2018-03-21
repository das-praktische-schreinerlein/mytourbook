import * as L from 'leaflet';
import {GeoElement, GeoElementType, GeoParser, LatLngTime} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';

export class GeoGpxParser extends GeoParser {
    public static fixXml(xml: string): string {
        if (!xml) {
            return xml;
        }

        xml = xml.replace('<--?xml version="1.0" encoding="UTF-8" standalone="no" ?-->',
            '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>');
        xml = xml.replace('<!--?xml version="1.0" encoding="UTF-8" standalone="no" ?-->',
            '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>');
        xml = xml.replace('</text><time>',
            '</text></link><time>');
        xml = xml.trim();

        return xml;
    }

    public static fixXmlExtended(xml: string): string {
        if (!xml) {
            return xml;
        }

        xml = xml.replace(/^[ \r\n]+/, '');
        xml = xml.replace(/[ \r\n]+$/, '');
        xml = xml.replace(/'/g, '"');

        if (!(xml.indexOf('<gpx') > 0)) {
            xml = '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1"' +
                ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                ' xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' + xml;
        }
        if (!(xml.startsWith('<?xml'))) {
            xml = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>' + xml;
        }

        if (!(xml.endsWith('</gpx>'))) {
            xml = xml + '</gpx>';
        }

        return xml;
    }

    public static reformatXml(xml: string): string {
        if (!xml) {
            return xml;
        }

        xml = xml.replace(/[\r\n]/g, ' ')
            .replace(/[ ]+/g, ' ')

            .replace(/<gpx /g, '\n<gpx ')
            .replace(/<gpx>/g, '\n<gpx>')
            .replace(/<\/gpx>/g, '\n</gpx>')

            .replace(/<trk /g, '\n  <trk ')
            .replace(/<trk>/g, '\n  <trk>')
            .replace(/<\/trk>/g, '\n  </trk>')

            .replace(/<trkseg /g, '\n  <trkseg ')
            .replace(/<trkseg>/g, '\n  <trkseg>')
            .replace(/<\/trkseg>/g, '\n  </trkseg>')

            .replace(/<rte /g, '\n  <rte ')
            .replace(/<rte>/g, '\n  <rte>')
            .replace(/<\/rte>/g, '\n  </rte>')

            .replace(/<trkpt /g, '\n      <trkpt ')
            .replace(/<rtept /g, '\n    <rtept ')
        ;

        return xml;
    }

    parse(xml: string, options): GeoElement[] {
        if (!xml) {
            console.error('cant parse GeoGpxParser: empty');
            return;
        }
        xml = GeoGpxParser.fixXml(xml);
        if (!(xml.startsWith('<?xml'))) {
            console.error('cant parse GeoGpxParser: no valid xml');
            return;
        }

        const oParser = new DOMParser();
        const gpxDom = oParser.parseFromString(xml, 'application/xml');
        if (gpxDom.getElementsByTagName('parsererror').length > 0) {
            console.error('cant parse GeoGpxParser: parsererror', gpxDom.getElementsByTagName('parsererror')[0]);
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
            const timeElement = ptElement.getElementsByTagName('time');
            let ele;
            let time;
            if (eleElement && eleElement.length > 0) {
                ele = eleElement[0].childNodes[0].nodeValue;
            }
            if (timeElement && timeElement.length > 0) {
                time = DateUtils.parseDate(timeElement[0].childNodes[0].nodeValue);
            }
            let ll;
            if (time !== undefined) {
                ll = new LatLngTime(ptElement.getAttribute('lat'), ptElement.getAttribute('lon'), ele, time);
            } else {
                ll = ele !== undefined ? new L.LatLng(ptElement.getAttribute('lat'), ptElement.getAttribute('lon'), ele) :
                new L.LatLng(ptElement.getAttribute('lat'), ptElement.getAttribute('lon'));
            }
            coords.push(ll);
        }
        return new GeoElement(tag === 'trkpt' ? GeoElementType.TRACK : GeoElementType.ROUTE, coords, name);
    }

    parse_wpt(e, gpxDom): GeoElement {
        const m = new GeoElement(GeoElementType.WAYPOINT, [new L.LatLng(e.getAttribute('lat'), e.getAttribute('lon'))], undefined);
        return m;
    }
}
