import type { CachedTilesInfo } from '@/interface'
import EPSG3857 from '@/helpers/EPSG3857'
import { TileInCache } from '@/enum'
import type { GeoJSONSource } from 'maplibre-gl'

class MAPTORIUMCACHEDMAP {
  private _map: maplibregl.Map | null = null
  private _cachedMap: CachedTilesInfo | null = null
  private _lastDrawTime = Math.floor(Date.now() / 1000)
  private _options = {
    colorMissing: 'rgb(0, 0, 0)',
    colorEmpty: 'rgb(255, 0, 0)',
    colorPresent: 'rgb(0, 255, 0)',
    idMissing: 'MCachedMapMissing',
    idPresent: 'MCachedMapPresent',
    idEmpty: 'MCachedMapEmpty',
    tileSize: 256,
    redrawTime: 10
  }
  // Create a GeoJSON source for present tiles.
  private _geojsonPresent: GeoJSONSource = {
    type: 'FeatureCollection',
    features: []
  }

  // Create a GeoJSON source for missing tiles.
  private _geojsonMissing: GeoJSONSource = {
    type: 'FeatureCollection',
    features: []
  }
  // Create a GeoJSON source for empty tiles.
  private _geojsonEmpty: GeoJSONSource = {
    type: 'FeatureCollection',
    features: []
  }

  public setData(cachedMap: CachedTilesInfo) {
    this._cachedMap = cachedMap
    this._redraw()
  }

  public updateTile(x: number, y: number, state: TileInCache) {
    if (this._cachedMap) {
      this._cachedMap.tiles[x][y] = state
    }
    const drawNowTime = Math.floor(Date.now() / 1000)
    if (drawNowTime - this._lastDrawTime > this._options.redrawTime) {
      this._lastDrawTime = drawNowTime
      this._redraw()
    }
  }
  public addOn(map: maplibregl.Map) {
    this._map = map
    this._redraw()
  }
  private _redraw() {
    if (this._map && this._cachedMap) {
      this._geojsonEmpty.features = []
      this._geojsonMissing.features = []
      this._geojsonPresent.features = []
      for (const x in this._cachedMap.tiles) {
        for (const y in this._cachedMap.tiles[x]) {
          const geojson = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[]]
            },
            properties: { ID: 0 }
          }
          const x1 = parseInt(x) * this._options.tileSize
          const y1 = parseInt(y) * this._options.tileSize
          let point = EPSG3857.pointToLatLng({ x: x1, y: y1 }, this._cachedMap.zoom)
          geojson.geometry.coordinates[0].push([point.lng, point.lat])
          point = EPSG3857.pointToLatLng(
            { x: x1 + this._options.tileSize, y: y1 },
            this._cachedMap.zoom
          )
          geojson.geometry.coordinates[0].push([point.lng, point.lat])
          point = EPSG3857.pointToLatLng(
            { x: x1 + this._options.tileSize, y: y1 + this._options.tileSize },
            this._cachedMap.zoom
          )
          geojson.geometry.coordinates[0].push([point.lng, point.lat])
          point = EPSG3857.pointToLatLng(
            { x: x1, y: y1 + this._options.tileSize },
            this._cachedMap.zoom
          )
          geojson.geometry.coordinates[0].push([point.lng, point.lat])
          //Put first point as last to close polygon
          geojson.geometry.coordinates[0].push(geojson.geometry.coordinates[0][0])

          switch (this._cachedMap.tiles[x][y]) {
            case TileInCache.empty:
              this._geojsonEmpty.features.push(geojson)
              break
            case TileInCache.missing:
              this._geojsonMissing.features.push(geojson)
              break
            case TileInCache.present:
              this._geojsonPresent.features.push(geojson)
              break
          }
        }
      }
      const sourceEmpty = this._map.getSource(this._options.idEmpty)
      if (sourceEmpty) {
        sourceEmpty.setData(this._geojsonEmpty)
      } else {
        this._map.addSource(this._options.idEmpty, {
          type: 'geojson',
          data: this._geojsonEmpty
        })
      }
      const sourceMissing = this._map.getSource(this._options.idMissing)
      if (sourceMissing) {
        sourceMissing.setData(this._geojsonMissing)
      } else {
        this._map.addSource(this._options.idMissing, {
          type: 'geojson',
          data: this._geojsonMissing
        })
      }
      const sourcePresent = this._map.getSource(this._options.idPresent)
      if (sourcePresent) {
        sourcePresent.setData(this._geojsonPresent)
      } else {
        this._map.addSource(this._options.idPresent, {
          type: 'geojson',
          data: this._geojsonPresent
        })
      }

      if (!this._map.getLayer(this._options.idEmpty)) {
        this._map.addLayer({
          id: this._options.idEmpty,
          source: this._options.idEmpty,
          type: 'fill',
          paint: {
            'fill-color': this._options.colorEmpty,
            'fill-opacity': 0.5
          }
        })
      }
      if (!this._map.getLayer(this._options.idMissing)) {
        this._map.addLayer({
          id: this._options.idMissing,
          source: this._options.idMissing,
          type: 'fill',
          paint: {
            'fill-color': this._options.colorMissing,
            'fill-opacity': 0.5
          }
        })
      }
      if (!this._map.getLayer(this._options.idPresent)) {
        this._map.addLayer({
          id: this._options.idPresent,
          source: this._options.idPresent,
          type: 'fill',
          paint: {
            'fill-color': this._options.colorPresent,
            'fill-opacity': 0.5
          }
        })
      }
    }
  }
}

const CachedMap = new MAPTORIUMCACHEDMAP()

export default CachedMap
