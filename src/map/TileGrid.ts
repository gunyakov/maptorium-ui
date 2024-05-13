import { setOptions } from '@/helpers/common'
import EPSG3857 from '@/helpers/EPSG3857'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Features, GPSCoords, POIInfo } from '@/interface'
import { POIType } from '@/enum'
import type { SourceSpecification } from 'maplibre-gl'
interface LatLng {
  lat: number
  lng: number
}

export interface TileGridOptions {
  zoom: number
  zoomOffset?: number
  show: boolean
  showText?: boolean
  color: string
  width: number
  opacity: number
  fillOpacity: number
  fillColor: string
  tileSize: number
  id: string
}

class MAPTORIUMTILEGRID {
  private _options: TileGridOptions = {
    zoom: 4,
    zoomOffset: 0,
    show: false,
    showText: true,
    color: '#3388ff',
    width: 1,
    opacity: 0.5,
    fillOpacity: 0.5,
    fillColor: '#444444',
    tileSize: 256,
    id: 'MaptoriumTileGrid'
  }

  private _gridGroupe: Features | null = null
  private _textGroupe: SourceSpecification = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  }
  private _callback: CallableFunction | null = null
  private _map: maplibregl.Map | null = null
  private _selectMode: Ref<boolean> = ref(false)

  constructor(options?: TileGridOptions) {
    setOptions(this, options)
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Fired when Tile Grid added to map
  //----------------------------------------------------------------------------------------------------------------------
  public onAdd(map: maplibregl.Map) {
    this._map = map
    map.on('zoomend', () => {
      this._update()
    })
    map.on('moveend', () => {
      this._update()
    })
    map.on('click', (e) => {
      this._tileSelect(e)
    })
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Remove Tile Grid from map
  //----------------------------------------------------------------------------------------------------------------------
  public remove() {
    this._options.zoom = -1
    this._options.zoomOffset = -1
    this._options.show = false
    this._clean()
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Set zoom for tile grid
  //----------------------------------------------------------------------------------------------------------------------
  public setZoom(zoom: number) {
    this._options.zoom = Math.round(zoom)
    this._options.zoomOffset = -1
    this._options.show = true
    this._update()
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Set zoom offset for tile grid
  //----------------------------------------------------------------------------------------------------------------------
  public setZoomOffset(zoom: number) {
    zoom = Math.round(zoom)
    if (zoom > 5) {
      zoom = 5
    }
    if (zoom < -1) {
      zoom = -1
    }

    this._options.zoomOffset = zoom
    this._options.zoom = -1
    this._options.show = true
    this._update()
  }
  public onSelect(callback: CallableFunction) {
    this._callback = callback
  }
  //------------------------------------------------------------------------------
  //Activate select tile as geometry
  //------------------------------------------------------------------------------
  public select() {
    this._selectMode.value = true
  }
  public get selectMode() {
    return this._selectMode
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Internal function to start update tile grid.
  //----------------------------------------------------------------------------------------------------------------------
  private _update() {
    this._clean()
    this._initGrid()
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Function to paint tile grid
  //----------------------------------------------------------------------------------------------------------------------
  private _initGrid() {
    if (this._map && this._options.show) {
      if (this._options.zoom == -1 && this._options.zoomOffset == -1) {
        this._clean()
        return true
      }
      let drawZoom = this._options.zoom
      const zoom = this._getZoom()
      if (this._options.zoomOffset != -1) {
        drawZoom = zoom + this._options.zoomOffset
      }

      let scaleFactor = drawZoom - zoom
      if (scaleFactor > 2) {
        this._options.showText = false
      } else {
        this._options.showText = true
      }
      if (scaleFactor > 5) {
        return true
      }
      if (drawZoom - zoom > 0) {
        scaleFactor = this._options.tileSize / Math.pow(2, scaleFactor)
      }
      if (drawZoom - zoom < 0) {
        scaleFactor = this._options.tileSize * Math.pow(2, Math.abs(scaleFactor))
      }
      if (drawZoom - zoom == 0) {
        scaleFactor = this._options.tileSize
      }
      const mapBounds = this._getPixelBounds()
      const x = Math.floor(mapBounds.min.x / scaleFactor)
      const y = Math.floor(mapBounds.min.y / scaleFactor)
      const x2 = Math.ceil(mapBounds.max.x / scaleFactor)
      const y2 = Math.ceil(mapBounds.max.y / scaleFactor)
      //Draw vertical lines
      for (let i = x; i <= x2; i++) {
        const xCoord = i * scaleFactor
        const pointA = EPSG3857.pointToLatLng({ x: xCoord, y: y * scaleFactor }, zoom)
        const pointB = EPSG3857.pointToLatLng({ x: xCoord, y: y2 * scaleFactor }, zoom)
        //console.log(pointA, pointB)
        this._pushLine(pointA, pointB)
      }
      //Draw horizontal lines
      for (let a = y; a <= y2; a++) {
        const yCoord = a * scaleFactor
        const pointA = EPSG3857.pointToLatLng({ x: x * scaleFactor, y: yCoord }, zoom)
        const pointB = EPSG3857.pointToLatLng({ x: x2 * scaleFactor, y: yCoord }, zoom)
        this._pushLine(pointA, pointB)
      }
      if (this._options.showText) {
        this._textGroupe.data.features = []
        //Draw text
        for (let i = x; i <= x2; i++) {
          for (let a = y; a <= y2; a++) {
            const point = EPSG3857.pointToLatLng(
              { x: i * scaleFactor + scaleFactor / 2, y: a * scaleFactor + scaleFactor / 2 },
              zoom
            )
            this._textGroupe.data.features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [point.lng, point.lat]
              },
              properties: { x: i.toString(), y: a.toString() }
            })
          }
        }
        //console.log(this._textGroupe.data.features)
        if (this._map.getSource('gridTextLabels')) {
          this._map.getSource('gridTextLabels')?.setData(this._textGroupe.data)
        } else {
          this._map.addSource('gridTextLabels', this._textGroupe)
        }
        if (!this._map.getLayer('gridTextLabels')) {
          this._map.addLayer({
            id: 'gridTextLabels',
            type: 'symbol',
            source: 'gridTextLabels',
            layout: {
              'text-field': 'x={x}\ny={y}',
              'text-font': ['KlokanTech Noto Sans Regular'],
              'text-transform': 'uppercase',
              visibility: 'visible'
            },
            paint: {
              'text-color': this._options.color,
              'text-halo-color': `rgba(255,255,255, ${this._options.opacity})`,
              'text-halo-width': this._options.width
            }
          })
        }
      }
    }
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Map specific functions to get bounds in pixels
  //----------------------------------------------------------------------------------------------------------------------
  private _getPixelBounds() {
    if (this._map) {
      const mapBounds = {
        min: EPSG3857.latLngToPoint(
          { lat: this._map.getBounds()._ne.lat, lng: this._map.getBounds()._sw.lng },
          this._getZoom()
        ),
        max: EPSG3857.latLngToPoint(
          { lat: this._map.getBounds()._sw.lat, lng: this._map.getBounds()._ne.lng },
          this._getZoom()
        )
      }
      return mapBounds
    }
    return {
      min: {
        x: 0,
        y: 0
      },
      max: { x: 0, y: 0 }
    }
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Map specific functions to get map zoom
  //----------------------------------------------------------------------------------------------------------------------
  private _getZoom() {
    if (this._map) {
      return Math.ceil(this._map.getZoom())
    }
    return 1
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Map specific function to remove grid from map
  //----------------------------------------------------------------------------------------------------------------------
  private _clean() {
    if (this._map?.getLayer(this._options.id)) this._map?.removeLayer(this._options.id)
    if (this._map?.getSource(this._options.id)) this._map?.removeSource(this._options.id)
    this._gridGroupe = null
    if (this._map?.getLayer('gridTextLabels')) this._map.removeLayer('gridTextLabels')
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Map specific function to draw grid lines
  //----------------------------------------------------------------------------------------------------------------------
  private _pushLine(point1: LatLng, point2: LatLng) {
    if (this._map) {
      //If no grid group
      if (!this._gridGroupe) {
        //Make grid grope from 0
        this._gridGroupe = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [point1.lng, point1.lat],
                  [point2.lng, point2.lat]
                ]
              }
            }
          ]
        }
        this._map.addSource(this._options.id, {
          type: 'geojson',
          //@ts-ignore
          data: this._gridGroupe
        })
        this._map.addLayer({
          id: this._options.id,
          type: 'line',
          source: this._options.id,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': this._options.color,
            'line-width': this._options.width,
            'line-opacity': this._options.opacity
          }
        })
      }
      //If grid grope is present
      else {
        //Push line to grid grope
        this._gridGroupe.features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [point1.lng, point1.lat],
              [point2.lng, point2.lat]
            ]
          }
        })
        //@ts-ignore
        this._map.getSource(this._options.id)?.setData(this._gridGroupe)
      }
    }
  }
  //----------------------------------------------------------------------------------------------------------------------
  //Map specific function to select tile as geometry
  //----------------------------------------------------------------------------------------------------------------------
  private _tileSelect(e: maplibregl.MapMouseEvent) {
    if (this._selectMode.value && this._map) {
      this._selectMode.value = false
      const zoom = this._getZoom()
      const points = EPSG3857.latLngToPoint(e.lngLat, zoom)
      const x1 = Math.floor(points.x / this._options.tileSize) * this._options.tileSize
      const y1 = Math.floor(points.y / this._options.tileSize) * this._options.tileSize
      const latlngs = []
      const coords: Array<GPSCoords> = []
      let point = EPSG3857.pointToLatLng({ x: x1, y: y1 }, zoom)
      latlngs.push([point.lng, point.lat])
      coords.push({ lat: point.lat, lng: point.lng })
      point = EPSG3857.pointToLatLng({ x: x1 + this._options.tileSize, y: y1 }, zoom)
      latlngs.push([point.lng, point.lat])
      coords.push({ lat: point.lat, lng: point.lng })
      point = EPSG3857.pointToLatLng(
        { x: x1 + this._options.tileSize, y: y1 + this._options.tileSize },
        zoom
      )
      latlngs.push([point.lng, point.lat])
      coords.push({ lat: point.lat, lng: point.lng })
      point = EPSG3857.pointToLatLng({ x: x1, y: y1 + this._options.tileSize }, zoom)
      latlngs.push([point.lng, point.lat])
      coords.push({ lat: point.lat, lng: point.lng })
      //Put first point as last to close polygon
      coords.push(coords[0])
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
        color: this._options.color
      }
      if (this._callback) {
        this._callback(geometry)
      }
    }
  }
}

const TileGrid = new MAPTORIUMTILEGRID()
export default TileGrid
