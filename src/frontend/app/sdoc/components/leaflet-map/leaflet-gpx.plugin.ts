/**
 * inspired by leaflet-plugins
  */
import layers = L.control.layers;
import {Http} from '@angular/http';
export class GPX extends L.FeatureGroup {
    options: any;
    _gpx: any;
    _layers: {};
    layers: {};
    http: Http;

    constructor(http: Http, gpx: string, options: {}) {
        super([]);
        this.http = http;
        this.initialize(http, gpx, options);
    }

    initialize(http: Http, gpx: string, options: {}) {
        this.http = http;
        L.Util.setOptions(this, options);
        this._gpx = gpx;
        this._layers = {};

        if (gpx) {
            this.addGPX(gpx, options, this.options.async);
        }
    }

    loadXML(url, cb, options, async) {
        if (async === undefined) {
            async = this.options.async;
        }
        if (options === undefined) {
            options = this.options;
        }

        this.http.request(url).subscribe(
            res => {
                cb(res.text(), options);
            },
            error => {
                console.error('loading appdata failed:' + error);
            });

/**
        const req = new XMLHttpRequest();
        req.open('GET', url, async);
        try {
            req.overrideMimeType('text/xml'); // unsupported by IE
        } catch (e) {}

        req.onreadystatechange = function () {
            if (req.readyState !== 4) {
                return;
            }
            if (req.status === 200) {
                cb(req.responseXML, options);
            }
        };
        req.send(null);
 **/
    }

    _humanLen(l) {
        if (l < 2000) {
            return l.toFixed(0) + ' m';
        } else {
            return (l / 1000).toFixed(1) + ' km';
        }
    }

    _polylineLen(line) {
        const ll = line._latlngs;
        let d = 0, p = null;
        for (let i = 0; i < ll.length; i++) {
            if (i && p) {
                d += p.distanceTo(ll[i]);
            }
            p = ll[i];
        }
        return d;
    }

    addGPX(url: string, options, async) {
        const me = this;
        const cb = function (gpx, options2) { me._addGPX(gpx, options2); };
        this.loadXML(url, cb, options, async);
    }

    _addGPX(xml: string, options) {
        if (!xml || !xml.startsWith('<?xml')) {
            this.fire('error');
            return;
        }

        const oParser = new DOMParser();
        const gpxDom = oParser.parseFromString(xml, 'text/xml');
        if (gpxDom.documentElement.nodeName === 'parsererror') {
            this.fire('error');
            return;
        }

        const layers = this.parseGPX(gpxDom, options);
        if (!layers) {
            this.fire('error');
            return;
        }
        this.addLayer(layers);
        this.fire('loaded', layers);
    }

    parseGPX(xml, options) {
        let j, i, el, layers = [];
        let named = false, tags = [['rte', 'rtept'], ['trkseg', 'trkpt']];

        for (j = 0; j < tags.length; j++) {
            el = xml.getElementsByTagName(tags[j][0]);
            for (i = 0; i < el.length; i++) {
                const l = this.parse_trkseg(el[i], xml, options, tags[j][1]);
                for (let k = 0; k < l.length; k++) {
                    if (this.parse_name(el[i], l[k])) {
                        named = true;
                    }
                    layers.push(l[k]);
                }
            }
        }

        el = xml.getElementsByTagName('wpt');
        if (options.display_wpt !== false) {
            for (i = 0; i < el.length; i++) {
                const marker = this.parse_wpt(el[i], xml, options);
                if (!marker) {
                    continue;
                }
                if (this.parse_name(el[i], marker)) {
                    named = true;
                }
                layers.push(marker);
            }
        }

        if (!layers.length) {
            return;
        }
        let layer = layers[0];
        if (layers.length > 1) {
            layer = new L.FeatureGroup(layers);
        }
        if (!named) {
            this.parse_name(xml, layer);
        }
        return layer;
    }

    parse_name(xml, layer) {
        let i, el, txt = '', name, descr = '', link, len = 0;
        el = xml.getElementsByTagName('name');
        if (el.length) {
            name = el[0].childNodes[0].nodeValue;
        }
        el = xml.getElementsByTagName('desc');
        for (i = 0; i < el.length; i++) {
            for (let j = 0; j < el[i].childNodes.length; j++) {
                descr = descr + el[i].childNodes[j].nodeValue;
            }
        }
        el = xml.getElementsByTagName('link');
        if (el.length) {
            link = el[0].getAttribute('href');
        }

        if (layer instanceof L.Path) {
            len = this._polylineLen(layer);
        }

        if (name) {
            txt += '<h2>' + name + '</h2>' + descr;
        }
        if (len) {
            txt += '<p>' + this._humanLen(len) + '</p>';
        }
        if (link) {
            txt += '<p><a target="_blank" href="' + link + '">[...]</a></p>';
        }

        if (layer && layer._popup === undefined) {
            layer.bindPopup(txt);
        }
        return txt;
    }

    parse_trkseg(line, xml, options, tag) {
        const el = line.getElementsByTagName(tag);
        if (!el.length) {
            return [];
        }
        const coords = [];
        for (let i = 0; i < el.length; i++) {
            const ll = new L.LatLng(el[i].getAttribute('lat'),
                el[i].getAttribute('lon'));
// TODO
//            ll.meta = {};
            for (const j in el[i].childNodes) {
                const e = el[i].childNodes[j];
                if (!e.tagName) {
                    continue;
                }
//                ll.meta[e.tagName] = e.textContent;
            }
            coords.push(ll);
        }
        const l = [new L.Polyline(coords, options)];
        this.fire('addline', {line: l});
        return l;
    }

    parse_wpt(e, xml, options) {
        const m = new L.Marker(new L.LatLng(e.getAttribute('lat'),
            e.getAttribute('lon')), options);
        const attributes = {};
        for (let i = 0; i < e.childNodes.length; i++) {
            const ch = e.childNodes[i];
            if (ch.nodeName !== '#text') {
                attributes[ch.nodeName] = ch.textContent;
            }
        }
        this.fire('addpoint', {point: m, attributes: attributes});
        return m;
    }
}
