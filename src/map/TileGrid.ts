import { POIType } from 'src/enum';
import type { GPSCoords, POIInfo } from 'src/interface';
import EPSG3857 from 'src/helpers/EPSG3857';
import { ref, type Ref } from 'vue';

interface LatLng {
  lat: number;
  lng: number;
}

interface TileGridFeatureCollection {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'LineString';
      coordinates: Array<[lng: number, lat: number]>;
    };
  }>;
}

interface TileTextFeatureCollection {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
    properties: {
      x: string;
      y: string;
    };
  }>;
}

export interface TileGridOptions {
  zoom: number;
  zoomOffset?: number;
  show: boolean;
  showText?: boolean;
  color: string;
  width: number;
  opacity: number;
  fillOpacity: number;
  fillColor: string;
  tileSize: number;
  id: string;
}

class MaptoriumTileGrid implements maplibregl.IControl {
  private _options: TileGridOptions = {
    zoom: 4,
    zoomOffset: -1,
    show: false,
    showText: true,
    color: '#3388ff',
    width: 1,
    opacity: 0.5,
    fillOpacity: 0.5,
    fillColor: '#444444',
    tileSize: 256,
    id: 'MaptoriumTileGrid',
  };

  private _gridGroup: TileGridFeatureCollection | null = null;
  private _textGroup: TileTextFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  private _callback: CallableFunction | null = null;
  private _map: maplibregl.Map | null = null;
  private _selectMode: Ref<boolean> = ref(false);
  private _container: HTMLDivElement | null = null;

  private _onZoomEnd?: () => void;
  private _onMoveEnd?: () => void;
  private _onClick?: (e: maplibregl.MapMouseEvent) => void;

  constructor(options?: Partial<TileGridOptions>) {
    if (options) {
      this._options = { ...this._options, ...options };
      if (typeof this._options.zoomOffset !== 'number') {
        this._options.zoomOffset = -1;
      }
    }
  }

  public onAdd(map: maplibregl.Map): HTMLElement {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl';
    this._container.style.display = 'none';

    this._onZoomEnd = () => {
      this._update();
    };
    this._onMoveEnd = () => {
      this._update();
    };
    this._onClick = (e: maplibregl.MapMouseEvent) => {
      this._tileSelect(e);
    };

    this._map.on('zoomend', this._onZoomEnd);
    this._map.on('moveend', this._onMoveEnd);
    this._map.on('click', this._onClick);

    return this._container;
  }

  public onRemove(): void {
    if (!this._map) {
      this._container?.remove();
      this._container = null;
      return;
    }

    if (this._onZoomEnd) this._map.off('zoomend', this._onZoomEnd);
    if (this._onMoveEnd) this._map.off('moveend', this._onMoveEnd);
    if (this._onClick) this._map.off('click', this._onClick);

    this._clean();
    this._container?.remove();
    this._container = null;
    this._map = null;
  }

  public getDefaultPosition(): maplibregl.ControlPosition {
    return 'top-right';
  }

  public remove() {
    this._options.zoom = -1;
    this._options.zoomOffset = -1;
    this._options.show = false;
    this._clean();
  }

  public setZoom(zoom: number) {
    this._options.zoom = Math.round(zoom);
    this._options.zoomOffset = -1;
    this._options.show = true;
    this._update();
  }

  public setZoomOffset(zoomOffset: number) {
    const normalized = Math.max(0, Math.min(7, Math.round(zoomOffset)));
    this._options.zoomOffset = normalized;
    this._options.zoom = -1;
    this._options.show = true;
    this._update();
  }

  public onSelect(callback: CallableFunction) {
    this._callback = callback;
  }

  public select() {
    this._selectMode.value = true;
  }

  public get selectMode() {
    return this._selectMode;
  }

  private _update() {
    this._clean();
    this._initGrid();
  }

  private _initGrid() {
    if (!this._map || !this._options.show) return;

    if (this._options.zoom === -1 && this._options.zoomOffset === -1) {
      this._clean();
      return;
    }

    let drawZoom = this._options.zoom;
    const currentZoom = this._getZoom();

    const zoomOffset = this._options.zoomOffset ?? -1;
    if (zoomOffset !== -1) {
      drawZoom = currentZoom + zoomOffset;
    }

    const zoomDelta = drawZoom - currentZoom;
    this._options.showText = zoomDelta <= 2;
    if (zoomDelta > 7) return;

    let scaleFactor = this._options.tileSize;
    if (zoomDelta > 0) {
      scaleFactor = this._options.tileSize / Math.pow(2, zoomDelta);
    } else if (zoomDelta < 0) {
      scaleFactor = this._options.tileSize * Math.pow(2, Math.abs(zoomDelta));
    }

    const mapBounds = this._getPixelBounds();
    const x = Math.floor(mapBounds.min.x / scaleFactor);
    const y = Math.floor(mapBounds.min.y / scaleFactor);
    const x2 = Math.ceil(mapBounds.max.x / scaleFactor);
    const y2 = Math.ceil(mapBounds.max.y / scaleFactor);

    for (let i = x; i <= x2; i++) {
      const xCoord = i * scaleFactor;
      const pointA = EPSG3857.pointToLatLng({ x: xCoord, y: y * scaleFactor }, currentZoom);
      const pointB = EPSG3857.pointToLatLng({ x: xCoord, y: y2 * scaleFactor }, currentZoom);
      this._pushLine(pointA, pointB);
    }

    for (let row = y; row <= y2; row++) {
      const yCoord = row * scaleFactor;
      const pointA = EPSG3857.pointToLatLng({ x: x * scaleFactor, y: yCoord }, currentZoom);
      const pointB = EPSG3857.pointToLatLng({ x: x2 * scaleFactor, y: yCoord }, currentZoom);
      this._pushLine(pointA, pointB);
    }

    if (this._options.showText) {
      this._textGroup.features = [];

      for (let i = x; i <= x2; i++) {
        for (let row = y; row <= y2; row++) {
          const point = EPSG3857.pointToLatLng(
            { x: i * scaleFactor + scaleFactor / 2, y: row * scaleFactor + scaleFactor / 2 },
            currentZoom,
          );

          this._textGroup.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat],
            },
            properties: { x: i.toString(), y: row.toString() },
          });
        }
      }

      const textSourceId = 'gridTextLabels';
      const source = this._map.getSource(textSourceId) as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData(this._textGroup as unknown as GeoJSON.FeatureCollection);
      } else {
        this._map.addSource(textSourceId, {
          type: 'geojson',
          data: this._textGroup as unknown as GeoJSON.FeatureCollection,
        });
      }

      if (!this._map.getLayer(textSourceId)) {
        this._map.addLayer({
          id: textSourceId,
          type: 'symbol',
          source: textSourceId,
          layout: {
            'text-field': 'x={x}\ny={y}',
            'text-font': ['KlokanTech Noto Sans Regular'],
            'text-transform': 'uppercase',
            visibility: 'visible',
          },
          paint: {
            'text-color': this._options.color,
            'text-halo-color': `rgba(255,255,255, ${this._options.opacity})`,
            'text-halo-width': this._options.width,
          },
        });
      }
    }
  }

  private _getPixelBounds() {
    if (!this._map) {
      return {
        min: { x: 0, y: 0 },
        max: { x: 0, y: 0 },
      };
    }

    const bounds = this._map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    return {
      min: EPSG3857.latLngToPoint({ lat: northEast.lat, lng: southWest.lng }, this._getZoom()),
      max: EPSG3857.latLngToPoint({ lat: southWest.lat, lng: northEast.lng }, this._getZoom()),
    };
  }

  private _getZoom() {
    if (!this._map) return 1;
    return Math.ceil(this._map.getZoom());
  }

  private _clean() {
    if (!this._map) return;

    if (this._map.getLayer(this._options.id)) this._map.removeLayer(this._options.id);
    if (this._map.getSource(this._options.id)) this._map.removeSource(this._options.id);
    this._gridGroup = null;

    if (this._map.getLayer('gridTextLabels')) this._map.removeLayer('gridTextLabels');
    if (this._map.getSource('gridTextLabels')) this._map.removeSource('gridTextLabels');
  }

  private _pushLine(point1: LatLng, point2: LatLng) {
    if (!this._map) return;

    if (!this._gridGroup) {
      this._gridGroup = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [point1.lng, point1.lat],
                [point2.lng, point2.lat],
              ],
            },
          },
        ],
      };

      this._map.addSource(this._options.id, {
        type: 'geojson',
        data: this._gridGroup as unknown as GeoJSON.FeatureCollection,
      });

      this._map.addLayer({
        id: this._options.id,
        type: 'line',
        source: this._options.id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': this._options.color,
          'line-width': this._options.width,
          'line-opacity': this._options.opacity,
        },
      });
      return;
    }

    this._gridGroup.features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [point1.lng, point1.lat],
          [point2.lng, point2.lat],
        ],
      },
    });

    const source = this._map.getSource(this._options.id) as maplibregl.GeoJSONSource | undefined;
    source?.setData(this._gridGroup as unknown as GeoJSON.FeatureCollection);
  }

  private _tileSelect(e: maplibregl.MapMouseEvent) {
    if (!this._selectMode.value || !this._map) return;

    this._selectMode.value = false;
    const zoom = this._getZoom();
    const points = EPSG3857.latLngToPoint(e.lngLat, zoom);
    const x1 = Math.floor(points.x / this._options.tileSize) * this._options.tileSize;
    const y1 = Math.floor(points.y / this._options.tileSize) * this._options.tileSize;

    const coords: GPSCoords[] = [];
    let point = EPSG3857.pointToLatLng({ x: x1, y: y1 }, zoom);
    coords.push({ lat: point.lat, lng: point.lng });

    point = EPSG3857.pointToLatLng({ x: x1 + this._options.tileSize, y: y1 }, zoom);
    coords.push({ lat: point.lat, lng: point.lng });

    point = EPSG3857.pointToLatLng(
      { x: x1 + this._options.tileSize, y: y1 + this._options.tileSize },
      zoom,
    );
    coords.push({ lat: point.lat, lng: point.lng });

    point = EPSG3857.pointToLatLng({ x: x1, y: y1 + this._options.tileSize }, zoom);
    coords.push({ lat: point.lat, lng: point.lng });

    if (coords.length > 0) {
      const first = coords[0] as GPSCoords;
      if (typeof first.dir === 'number') {
        coords.push({ lat: first.lat, lng: first.lng, dir: first.dir });
      } else {
        coords.push({ lat: first.lat, lng: first.lng });
      }
    }

    const geometry: POIInfo = {
      ID: 0,
      points: coords,
      name: 'TilePolygon',
      categoryID: 0,
      type: POIType.polygon,
      visible: 1,
      fillColor: this._options.fillColor,
      fillOpacity: this._options.fillOpacity,
      width: this._options.width,
      color: this._options.color,
    };

    if (this._callback) {
      this._callback(geometry);
    }
  }
}

const TileGrid = new MaptoriumTileGrid();
export default TileGrid;
