import CONFIG from "../config";
import { Icon, icon, map, tileLayer, marker, popup, latLng } from "leaflet";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Exported function to get place name from coordinates
 */
export const getPlaceNameByCoor = async (latitude, longitude) => {
    try {
        const url = new URL(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json`);
        url.searchParams.set('key', CONFIG.MAP_SERVICES);
        url.searchParams.set('language', 'id');
        url.searchParams.set('limit', '1');
        
        const res = await fetch(url);
        const data = await res.json();
        const place = data.features[0].place_name.split(', ');
        return [place.at(-2), place.at(-1)].join(', ');
    } catch (e) {
        console.error('getPlaceNameByCoor: error', e);
        return `${latitude}, ${longitude}`;
    }
};


export default class Map {
    #zoom = 5;
    #map = null;

    static isGeolocationAvailable() {
        return 'geolocation' in navigator;
    }

    static getCurrentPosition(options = {}) {
        return new Promise((resolve, reject) => {
            if (!Map.isGeolocationAvailable()) {
                reject('API tidak support');
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    

    static async build(selector, options = {}) {
        const fallbackCoor = [-6.4577652, 106.8451014];
        if ('center' in options && options.center) {
            return new Map(selector, options);
        }

        if ('locate' in options && options.locate) {
            try {
                const position = await Map.getCurrentPosition();
                const coor = [position.coords.latitude, position.coords.longitude];
                return new Map(selector, {
                    ...options,
                    center: coor,
                });
            } catch (e) {
                console.error('build: error:', e);
                return new Map(selector, {
                    ...options,
                    center: fallbackCoor,
                });
            }
        }

        return new Map(selector, {
            ...options,
            center: fallbackCoor,
        });
    }

    constructor(selector, options = {}) {
        this.#zoom = options.zoom ?? this.#zoom;

        const tiles = tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        });

        this.#map = map(document.querySelector(selector), {
            zoom: this.#zoom,
            scrollWheelZoom: false,
            layers: [tiles],
            ...options,
        });
    }

    changeCamera(coordinate, zoomLevel = null) {
        const targetZoom = zoomLevel ?? this.#zoom;
        this.#map.setView(latLng(coordinate), targetZoom);
    }

    getCenter() {
        const center = this.#map.getCenter();
        return {
            latitude: center.lat,
            longitude: center.lng,
        };
    }

    createIcon(options = {}) {
        return icon({
            ...Icon.Default.prototype.options,
            iconRetinaUrl: markerIcon2x,
            iconUrl: markerIcon,
            shadowUrl: markerShadow,
            ...options,
        });
    }

    addMarker(coor, markerOptions = {}, popupOption = null) {
        if (typeof markerOptions !== 'object') {
            throw new Error('markerOptions must be an object');
        }

        const newMark = marker(coor, {
            icon: this.createIcon(),
            ...markerOptions,
        });

        if (popupOption) {
            if (typeof popupOption !== 'object') {
                throw new Error('popupOption harus berupa objek');
            }
            if (!('content' in popupOption)) {
                throw new Error('popupOption harus memiliki properti "content"');
            }
            const newPopup = popup(coor, popupOption);
            newMark.bindPopup(newPopup);
        }

        newMark.addTo(this.#map);
        return newMark;
    }

    on(eventName, callback) {
        this.#map.on(eventName, callback);
    }
}
