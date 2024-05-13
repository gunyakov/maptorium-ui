import maplibregl from 'maplibre-gl'

import API from '@/API/index'
import { POIType, eMapFormat, MAPEvents } from '@/enum'
import type { GPSCoords, POIInfo, Style, iMapItem } from '@/interface'

import Line from './Line'
import Polygon from './Polygon'
//import Marker from './Marker'
import Point from './Point'
import InfoBar from '@/API/InfoBar'
import { ConvertDEGToDMS } from '@/helpers/formaters'
import type Geometry from './Geometry'
import request from '@/API/ajax'
import Marker from './Marker'

class MaptoriumMap {
  private _map: maplibregl.Map | null = null
  private _GPSMarker: Point | null = null
  public GPSRoute: Line | null = null
  private _showGPSMarker: boolean = false
  private _geometryCollection: { [id: number]: Geometry | null } = {}
  private _baseMap: iMapItem | null = null
  private _callbacks: { [id: string]: CallableFunction } = {}
  private _extendStyle: maplibregl.StyleSpecification | null = null
  private _extendStyleID: string = ''
  private _layersMap: Array<iMapItem> = []
  constructor() {}
  /**
   * Init map and other nessesary connections
   */
  public async init() {
    const map = new maplibregl.Map({
      //accessToken: 'wbw4tKDjEjT5EOx2fCDq',
      container: 'map',
      style: 'styles/style.json',
      center: [0, 0],
      zoom: 3,
      attributionControl: false,
      transformRequest: (url, resourceType) => {
        if (resourceType == 'Tile') {
          url = `${window.location.protocol}//${window.location.host}/${url}`
        } else if (
          resourceType == 'Source' ||
          resourceType == 'Glyphs' ||
          resourceType == 'SpriteJSON'
        ) {
          url =
            `${window.location.protocol}//${window.location.host}/` +
            url.replace('http://localhost/', '')
        } else if (resourceType == 'SpriteImage')
          url = `${window.location.protocol}//${window.location.host}/styles/sprite/sprite.png`
        else if (resourceType == 'Style') {
          url = `${window.location.protocol}//${window.location.host}/${url}`
        } else {
          console.log(resourceType, url)
        }
        return {
          url: url,
          resourceType: resourceType,
          credentials: 'include'
        }
      }
    })
    this._map = map

    map.once('load', () => {
      InfoBar.zoom.value = Math.round(map.getZoom())
      this.GPSRoute = new Line(this.map)
      // Insert the layer beneath any symbol layer.
      // const layers = map.getStyle().layers

      // let labelLayerId
      // for (let i = 0; i < layers.length; i++) {
      //   if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      //     labelLayerId = layers[i].id
      //     break
      //   }
      // }
      // map.addLayer(
      //   {
      //     id: '3d-buildings',
      //     source: 'openmaptiles',
      //     'source-layer': 'building',
      //     type: 'fill-extrusion',
      //     minzoom: 15,
      //     paint: {
      //       'fill-extrusion-color': [
      //         'case',
      //         ['==', ['get', 'id'], 764415869],
      //         'red',
      //         'hsl(30, 79%, 81%)'
      //       ],
      //       'fill-extrusion-height': [
      //         'interpolate',
      //         ['linear'],
      //         ['zoom'],
      //         15,
      //         0,
      //         16,
      //         ['get', 'render_height']
      //       ],
      //       'fill-extrusion-base': [
      //         'case',
      //         ['>=', ['get', 'zoom'], 16],
      //         ['get', 'render_min_height'],
      //         0
      //       ]
      //     }
      //   },
      //   labelLayerId
      // )
      this._fire(MAPEvents.init, this._map)
      //this._fire(MAPEvents.POIRefresh)
    })
    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point)
      let changeCoursor = false
      features.forEach((item) => {
        if (item.source.includes('MPolygon')) {
          changeCoursor = true
        }
        if (item.source.includes('MMarker')) {
          changeCoursor = true
        }
        if (item.source.includes('MPolyline')) {
          changeCoursor = true
        }
      })
      if (changeCoursor) {
        // Change the cursor style as a UI indicator.
        //console.log(features)
        map.getCanvas().style.cursor = 'pointer'
      } else {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'hand'
      }
      InfoBar.lat.value = ConvertDEGToDMS(e.lngLat.lat, true)
      InfoBar.lng.value = ConvertDEGToDMS(e.lngLat.lng, false)

      const element = document.getElementById('info')
      if (element) {
        element.innerHTML =
          // e.point is the x, y coordinates of the mousemove event relative
          // to the top-left corner of the map
          `${JSON.stringify(e.point)}<br />${
            // e.lngLat is the longitude, latitude geographical position of the event
            JSON.stringify(e.lngLat.wrap())
          }`
      }
    })
    map.on('zoomend', () => {
      InfoBar.zoom.value = Math.round(map.getZoom())
    })
    map.on('click', '3d-buildings', (e) => {
      if (!e.features) return
      //const id = Date.now()
      //if (!features[0].id) features[0].id = id
      if (!e.features[0].properties.id) e.features[0].properties.id = e.features[0].id

      console.log('Building', e.features[0])
      map.setPaintProperty('3d-buildings', 'fill-extrusion-color', [
        'case',
        ['==', ['get', 'id'], e.features[0].id],
        'red',
        'hsl(30, 79%, 81%)'
      ])
    })
    // Create a popup, but don't add it to the map yet.
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    })
    map.on('mouseenter', '3d-buildings', (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer'

      if (e.features?.length) {
        const description = e.features[0].id?.toString() || '0'

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.lngLat).setHTML(description).addTo(map)
      }
    })

    map.on('mouseleave', '3d-buildings', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })
    //Set current position, to restore after loading
    map.on('moveend', () => {
      //Get map center
      const coords = map.getCenter()
      //If coords is 0, map was initialy loaded, skip setting default coords
      if (coords.lat != 0 && coords.lng != 0)
        API.DefConfigSet(
          { lat: coords.lat, lng: coords.lng, zoom: Math.round(map.getZoom()) },
          false
        )
    })
    map.on('mousedown', () => {
      this._fire(MAPEvents.ctxMenuHide)
    })

    map.on('contextmenu', (e) => {
      const features = map.queryRenderedFeatures(e.point)
      let mID = 0
      let type = POIType.point
      features.forEach((item) => {
        if (item.source.includes('MPolygon')) {
          mID = item.properties.ID
          type = POIType.polygon
        }
        if (item.source.includes('MMarker')) {
          mID = item.properties.ID
          type = POIType.point
        }
        if (item.source.includes('MPolyline')) {
          mID = item.properties.ID
          type = POIType.polyline
        }
      })
      this._fire(MAPEvents.ctxMenuShow, mID, type, e.point, e.lngLat)
    })
  }
  /**
   * Returm map for read only
   */
  public get map() {
    return this._map
  }
  /**
   * Add GPS marker to map
   * @param lat - Latitude
   * @param lng - Longitude
   * @param dir - Direction to rotate marker
   */
  public GPSMarker(lat: number, lng: number, dir?: number) {
    //if (!this._GPSMarker && this.map) this._GPSMarker = new Marker(this.map, 'GPSMarker')
    if (!this._GPSMarker && this.map) {
      this._GPSMarker = new Point(this.map, 'GPSMarker')
      this._GPSMarker.setStyle({
        width: 3,
        color: '#FFFFFF',
        fillColor: '#007cbf',
        radius: 7,
        fillOpacity: 1
      })
    }
    if (this._GPSMarker) {
      this._GPSMarker.Points([{ lat: lat, lng: lng, dir: dir || 0 }])
      this._showGPSMarker = true
    }
  }
  /**
   * Hide or show GPS marker
   */
  public set showMarker(value: boolean) {
    if (value) {
      this._GPSMarker?.show()
      this._showGPSMarker = true
    } else {
      this._GPSMarker?.hide()
      this._showGPSMarker = false
    }
  }
  /**
   * Return current status of GPS marker - hide or show
   */
  public get showMarker() {
    return this._showGPSMarker
  }
  /**
   * Move map center to coords
   * @param lat - Latitude
   * @param lng - Longitude
   */
  public mapCenter(lat: number, lng: number, zoom?: number) {
    if (this.map) {
      this.map.setCenter([lng, lat])
      if (zoom) this.map.setZoom(zoom)
    }
  }
  /**
   * Change language for map labels
   * @param lang - Language shortcode
   */
  public mapLang(lang: string) {
    const labels = [
      'waterway-name',
      'water-name-lakeline',
      'water-name-ocean',
      'water-name-other',
      'poi-railway',
      'highway-name-path',
      'highway-name-minor',
      'highway-name-major',
      'airport-label-major',
      'place-other',
      'place-village',
      'place-town',
      'place-city',
      'place-city-capital',
      'place-state',
      'place-country-other',
      'place-country-3',
      'place-country-2',
      'place-country-1',
      'place-continent'
    ]
    const key = `name:${lang}`
    //if (lang == 'ru') key = `{name:${lang}} {name:nonlatin}`
    if (this.map) {
      labels.forEach((value) => {
        this.map?.setLayoutProperty(value, 'text-field', [
          'case',
          ['has', key],
          ['get', key],
          ['get', 'name']
        ])
      })
    }
  }
  /**
   * Add POI to map
   * @param id - POI ID
   * @param coords - Array of points
   * @param style - Paint style
   */
  public PoiAdd(type: POIType, ID: number, coords: Array<GPSCoords>, style?: Style) {
    if (this.map) {
      let geometry: Geometry | null = null
      switch (type) {
        case POIType.polygon:
          geometry = new Polygon(this.map, ID)
          break
        case POIType.polyline:
          geometry = new Line(this.map, ID)
          break
        case POIType.point:
          geometry = new Marker(this._map, ID)
          break
      }
      if (geometry) {
        geometry.setStyle(style)
        geometry.Points(coords)
        this._geometryCollection[ID] = geometry
      }
    }
  }
  /**
   * Delete POI from map
   * @param ID  - POI ID
   */
  public PoiDelete(ID: number) {
    this._geometryCollection[ID]?.hide()
  }
  public PoiUpdate(ID: number, poiInfo: POIInfo) {
    if (this._geometryCollection[ID]) {
      this._geometryCollection[ID]?.setStyle(poiInfo)
      this._geometryCollection[ID]?.hide()
      this._geometryCollection[ID]?.show()
    }
  }
  public async SetMap(mapInfo: iMapItem, style?: string) {
    let needUpdate = false
    if (this._baseMap?.id != mapInfo.id) {
      this._baseMap = mapInfo
      needUpdate = true
    }
    if (await this._getStyle(style)) needUpdate = true
    if (needUpdate) this._updateMapStyle()
  }

  public get baseMap() {
    return this._baseMap
  }

  public async AddLayer(layerInfo: iMapItem, style?: string) {
    this._layersMap.push(layerInfo)
    await this._getStyle(style)
    this._updateMapStyle()
  }

  public async RemoveLayer(layerInfo: iMapItem) {
    let itemIndex: number | null = null

    this._layersMap.forEach((item, index) => {
      if (item.id == layerInfo.id) itemIndex = index
    })

    if (itemIndex !== null) {
      this._layersMap.splice(itemIndex, 1)
      this._updateMapStyle()
    }
  }

  private async _getStyle(style?: string): Promise<boolean> {
    if (style != undefined && style != this._extendStyleID) {
      this._extendStyleID = style
      const jsonStyle = (await request(`styles/${style}.json`)) as
        | maplibregl.StyleSpecification
        | false
      //If style from server
      if (jsonStyle) {
        //Save style
        this._extendStyle = jsonStyle
      }
      return true
    }
    return false
  }
  private _updateMapStyle() {
    if (this._map) {
      console.log('Update map style')
      let anyVectorMap = false
      //If style from server is
      const mainStyle = {
        version: 8,
        name: 'MAPTORIUM',
        metadata: {
          'mapbox:autocomposite': false,
          'mapbox:groups': {
            '1444849242106.713': { collapsed: false, name: 'Places' },
            '1444849334699.1902': { collapsed: true, name: 'Bridges' },
            '1444849345966.4436': { collapsed: false, name: 'Roads' },
            '1444849354174.1904': { collapsed: true, name: 'Tunnels' },
            '1444849364238.8171': { collapsed: false, name: 'Buildings' },
            '1444849382550.77': { collapsed: false, name: 'Water' },
            '1444849388993.3071': { collapsed: false, name: 'Land' }
          }
        },
        center: [0, 0],
        zoom: 1,
        bearing: 0,
        pitch: 0,
        sources: {},
        sprite: 'http://localhost/styles/sprite/sprite',
        glyphs: 'styles/fonts/{fontstack}/{range}.pbf',
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#f8f4f0' }
          }
        ],
        id: 'MAPTORIUM'
      }
      //If map is raster
      if (this._baseMap?.format == eMapFormat.rasted) {
        //Set tile path for base raster layout
        mainStyle.sources['raster-source'] = {
          type: 'raster',
          tiles: [`tile/${this._baseMap.id}/{z}/{x}/{y}`],
          minzoom: 0,
          maxzoom: 22,
          tileSize: this._baseMap.tileSize
        }
        //Make base raster map visible
        mainStyle.layers.push({
          id: 'raster-base-layer',
          type: 'raster',
          source: 'raster-source',
          layout: {
            visibility: 'visible'
          }
        })
      }
      this._layersMap.forEach((item) => {
        if (item.format == eMapFormat.vector) {
          anyVectorMap = true
          mainStyle.sources['openmaptiles'] = {
            type: 'vector',
            tiles: [`tile/${item.id}/{z}/{x}/{y}`],
            minzoom: 0,
            maxzoom: 14,
            format: 'pbf',
            pixel_scale: '256'
          }
        }
        if (item.format == eMapFormat.rasted) {
          //Set tile path for base raster layout
          mainStyle.sources[`raster-source-${item.id}`] = {
            type: 'raster',
            tiles: [`tile/${item.id}/{z}/{x}/{y}`],
            minzoom: 0,
            maxzoom: 22,
            tileSize: item.tileSize
          }
          //Make base raster map visible
          mainStyle.layers.push({
            id: `raster-layer-${item.id}`,
            type: 'raster',
            source: `raster-source-${item.id}`,
            layout: {
              visibility: 'visible'
            }
          })
        }
      })
      //If map is vector
      if (this._baseMap?.format == eMapFormat.vector) {
        mainStyle.sources['openmaptiles'] = {
          type: 'vector',
          tiles: [`tile/${this._baseMap.id}/{z}/{x}/{y}`],
          minzoom: 0,
          maxzoom: 14,
          format: 'pbf',
          pixel_scale: '256'
        }
        anyVectorMap = true
      }
      if (this._extendStyle && anyVectorMap) {
        //Add extend style for vector tiles
        this._extendStyle.layers.forEach((item) => {
          mainStyle.layers.push(item)
        })
      }
      //Set style for map
      this._map.setStyle(mainStyle)
      //If need update, fire event to redraw POI
      this._fire(MAPEvents.POIRefresh)
    }
  }

  public on(event: MAPEvents, callback: CallableFunction) {
    if (callback) {
      this._callbacks[event] = callback
    }
  }

  public _fire(event: MAPEvents, data1?: any, data2?: any, data3?: any, data4?: any) {
    if (this._callbacks[event]) {
      this._callbacks[event](data1, data2, data3, data4)
    }
  }
}
//Init new MAP class
const Map = new MaptoriumMap()

export default Map
