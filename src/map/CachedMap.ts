import type { Feature, FeatureCollection, Polygon, Position } from 'geojson';
import type { CachedTilesInfo } from 'src/interface';
import EPSG3857 from 'src/helpers/EPSG3857';
import { TileInCache } from 'src/enum';
import socket from 'src/API/Socket';
import { setCachedMapBarProgress, type CachedMapProgress } from 'src/composables/useCachedMapBar';

class MAPTORIUMCACHEDMAP implements maplibregl.IControl {
  private _map: maplibregl.Map | null = null;
  private _cachedMap: CachedTilesInfo | null = null;
  private _lastDrawTime = Math.floor(Date.now() / 1000);
  private _options = {
    colorMissing: 'rgb(0, 0, 0)',
    colorEmpty: 'rgb(255, 0, 0)',
    colorPresent: 'rgb(0, 255, 0)',
    idMissing: 'MCachedMapMissing',
    idPresent: 'MCachedMapPresent',
    idEmpty: 'MCachedMapEmpty',
    tileSize: 256,
    redrawTime: 10,
  };
  private _container: HTMLDivElement | null = null;
  // GeoJSON holders for cached tiles visualization.
  private _geojsonPresent: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [],
  };

  private _geojsonMissing: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [],
  };

  private _geojsonEmpty: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [],
  };

  public setData(cachedMap: CachedTilesInfo) {
    this._cachedMap = cachedMap;
    this._redraw();
  }

  public updateTile(x: number, y: number, state: TileInCache) {
    if (!this._cachedMap) return;
    if (!this._cachedMap.tiles[x])
      this._cachedMap.tiles[x] = {} as CachedTilesInfo['tiles'][number];
    this._cachedMap.tiles[x][y] = state;
    const drawNowTime = Math.floor(Date.now() / 1000);
    if (drawNowTime - this._lastDrawTime > this._options.redrawTime) {
      this._lastDrawTime = drawNowTime;
      this._redraw();
    }
  }
  public onAdd(map: maplibregl.Map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl';
    this._container.style.display = 'none';
    this._redraw();
    return this._container;
  }
  public onRemove() {
    this._map = null;
    if (this._container?.parentNode) this._container.parentNode.removeChild(this._container);
    this._container = null;
  }
  private _redraw() {
    if (!this._map || !this._cachedMap) return;

    this._geojsonEmpty.features = [];
    this._geojsonMissing.features = [];
    this._geojsonPresent.features = [];

    for (const xKey in this._cachedMap.tiles) {
      const row = this._cachedMap.tiles[Number(xKey)];
      if (!row) continue;

      for (const yKey in row) {
        const tileState = row[Number(yKey)];
        if (tileState === undefined) continue;

        const geojson: Feature<Polygon> = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]],
          },
          properties: { ID: 0 },
        };

        const x1 = parseInt(xKey) * this._options.tileSize;
        const y1 = parseInt(yKey) * this._options.tileSize;
        const ring: Position[] =
          geojson.geometry.coordinates[0] ?? (geojson.geometry.coordinates[0] = []);

        let point = EPSG3857.pointToLatLng({ x: x1, y: y1 }, this._cachedMap.zoom);
        const first: Position = [point.lng, point.lat];
        ring.push(first);
        point = EPSG3857.pointToLatLng(
          { x: x1 + this._options.tileSize, y: y1 },
          this._cachedMap.zoom,
        );
        ring.push([point.lng, point.lat]);
        point = EPSG3857.pointToLatLng(
          { x: x1 + this._options.tileSize, y: y1 + this._options.tileSize },
          this._cachedMap.zoom,
        );
        ring.push([point.lng, point.lat]);
        point = EPSG3857.pointToLatLng(
          { x: x1, y: y1 + this._options.tileSize },
          this._cachedMap.zoom,
        );
        ring.push([point.lng, point.lat]);
        // close polygon
        ring.push(first);

        switch (tileState) {
          case TileInCache.empty:
            this._geojsonEmpty.features.push(geojson);
            break;
          case TileInCache.missing:
            this._geojsonMissing.features.push(geojson);
            break;
          case TileInCache.present:
            this._geojsonPresent.features.push(geojson);
            break;
        }
      }
    }

    const sourceEmpty = this._map.getSource(this._options.idEmpty);
    if (sourceEmpty && 'setData' in sourceEmpty) {
      sourceEmpty.setData(this._geojsonEmpty);
    } else {
      this._map.addSource(this._options.idEmpty, {
        type: 'geojson',
        data: this._geojsonEmpty,
      });
    }

    const sourceMissing = this._map.getSource(this._options.idMissing);
    if (sourceMissing && 'setData' in sourceMissing) {
      sourceMissing.setData(this._geojsonMissing);
    } else {
      this._map.addSource(this._options.idMissing, {
        type: 'geojson',
        data: this._geojsonMissing,
      });
    }

    const sourcePresent = this._map.getSource(this._options.idPresent);
    if (sourcePresent && 'setData' in sourcePresent) {
      sourcePresent.setData(this._geojsonPresent);
    } else {
      this._map.addSource(this._options.idPresent, {
        type: 'geojson',
        data: this._geojsonPresent,
      });
    }

    if (!this._map.getLayer(this._options.idEmpty)) {
      this._map.addLayer({
        id: this._options.idEmpty,
        source: this._options.idEmpty,
        type: 'fill',
        paint: {
          'fill-color': this._options.colorEmpty,
          'fill-opacity': 0.5,
        },
      });
    }
    if (!this._map.getLayer(this._options.idMissing)) {
      this._map.addLayer({
        id: this._options.idMissing,
        source: this._options.idMissing,
        type: 'fill',
        paint: {
          'fill-color': this._options.colorMissing,
          'fill-opacity': 0.5,
        },
      });
    }
    if (!this._map.getLayer(this._options.idPresent)) {
      this._map.addLayer({
        id: this._options.idPresent,
        source: this._options.idPresent,
        type: 'fill',
        paint: {
          'fill-color': this._options.colorPresent,
          'fill-opacity': 0.5,
        },
      });
    }
  }
}

const CachedMap = new MAPTORIUMCACHEDMAP();

export default CachedMap;

socket.on('cachedtile.map', (data: CachedTilesInfo) => {
  CachedMap.setData(data);
});
socket.on('cachedtile.progress', (data: CachedMapProgress) => {
  setCachedMapBarProgress(data);
});
socket.on('cachedtile.tile', (data: { x: number; y: number; state: TileInCache }) => {
  CachedMap.updateTile(data.x, data.y, data.state);
});
