import maplibregl, { type FlyToOptions } from 'maplibre-gl'

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
import wait from '@/helpers/wait'
/**
 * Custom Button to center map to GPS
 * */
const gpsPosition: FlyToOptions = {
  center: [144, -37]
}
class GPSToCenterButton {
  private container: HTMLDivElement | undefined = undefined
  private map: maplibregl.Map | undefined = undefined
  onAdd(map: maplibregl.Map) {
    const div = document.createElement('div')
    div.className = 'maplibregl-ctrl maplibregl-ctrl-group'
    div.innerHTML = `<button class='maplibregl-ctrl-geolocate maplibregl-ctrl-geolocate-active'>
    <span class="maplibregl-ctrl-icon" aria-hidden="true"></span> </button>`
    div.addEventListener('contextmenu', (e) => e.preventDefault())
    div.addEventListener('click', () => map.flyTo(gpsPosition))
    this.container = div
    this.map = map
    return div
  }
  onRemove() {
    if (this.container) this.container.parentNode?.removeChild(this.container)
    if (this.map) this.map = undefined
  }
}
/**
 * Custom Button to Hide water polygon
 */
let hideWater = false
class HideWaterButton {
  private container: HTMLDivElement | undefined = undefined
  private map: maplibregl.Map | undefined = undefined
  onAdd(map: maplibregl.Map) {
    const div = document.createElement('div')
    div.className = 'maplibregl-ctrl maplibregl-ctrl-group'
    div.innerHTML = `<button>
    <svg class="svg-icon" style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M853.31968 526.37696c-12.288-122.01984-63.8976-213.68832-126.03392-213.68832-25.47712 0-49.152 15.48288-69.2224 42.10688C624.55808 281.51808 581.632 237.568 534.7328 237.568s-90.112 44.31872-123.65824 118.00576c-20.0704-27.0336-43.99104-42.76224-69.632-42.76224-62.0544 0-113.90976 91.70944-125.952 213.68832zM722.90304 677.92896a121.11872 121.11872 0 0 0-44.07296 26.624 70.08256 70.08256 0 0 1-23.10144 13.68064c-16.7936 5.5296-31.49824 1.26976-46.44864-13.68064-29.20448-29.20448-65.3312-38.62528-101.66272-26.46016a122.0608 122.0608 0 0 0-44.31872 26.70592l-0.57344 0.57344s-15.19616 14.78656-33.5872 15.27808c-11.75552 0.32768-23.26528-5.12-35.18464-16.384-30.14656-28.672-66.7648-38.13376-103.0144-26.2144a102.89152 102.89152 0 0 0-21.2992 9.216 322.43712 322.43712 0 0 0 34.97984 42.5984 37.15072 37.15072 0 0 1 4.096-1.4336c17.03936-5.03808 32.23552-0.49152 47.84128 14.45888 21.83168 20.80768 45.75232 31.41632 71.35232 31.41632h2.2528c38.78912-0.94208 65.536-26.29632 70.69696-31.41632a71.18848 71.18848 0 0 1 24.576-14.25408c16.384-5.03808 30.88384-0.57344 45.42464 13.9264 29.20448 29.20448 65.24928 38.62528 101.33504 26.624a120.91392 120.91392 0 0 0 43.90912-26.46016 67.82976 67.82976 0 0 1 24.576-14.17216 38.37952 38.37952 0 0 1 24.28928 0 322.39616 322.39616 0 0 0 34.816-42.76224 92.20096 92.20096 0 0 0-76.88192-7.86432zM818.62656 591.29856c-29.20448-29.20448-65.24928-38.62528-101.33504-26.624a121.11872 121.11872 0 0 0-44.07296 26.624 68.97664 68.97664 0 0 1-23.10144 13.68064c-16.7936 5.5296-31.49824 1.26976-46.44864-13.68064-29.20448-29.20448-65.3312-38.62528-101.66272-26.46016a122.0608 122.0608 0 0 0-44.31872 26.70592l-0.49152 0.49152a60.86656 60.86656 0 0 1-22.9376 13.5168c-9.99424 3.03104-25.6 4.79232-45.99808-14.70464-30.3104-28.672-66.92864-38.13376-103.17824-26.29632a121.11872 121.11872 0 0 0-44.56448 26.624l-0.73728 0.73728a65.536 65.536 0 0 1-12.00128 8.76544 318.75072 318.75072 0 0 0 20.48 49.9712 112.64 112.64 0 0 0 30.06464-21.21728 70.90176 70.90176 0 0 1 23.42912-13.76256 40.96 40.96 0 0 1 17.98144-2.17088c10.73152 0.94208 20.97152 6.30784 31.49824 16.384 21.83168 20.80768 45.75232 31.41632 71.35232 31.41632h2.2528c39.03488-0.94208 65.98656-26.624 70.77888-31.49824a70.90176 70.90176 0 0 1 23.42912-13.76256c16.95744-5.61152 31.82592-1.35168 46.77632 13.5168 29.20448 29.20448 65.24928 38.62528 101.33504 26.624a121.11872 121.11872 0 0 0 44.07296-26.624 67.9936 67.9936 0 0 1 23.10144-13.59872c16.7936-5.5296 31.49824-1.26976 46.44864 13.68064a111.45216 111.45216 0 0 0 38.13376 25.51808 318.95552 318.95552 0 0 0 20.76672-49.93024 55.296 55.296 0 0 1-21.05344-13.9264z"  /></svg> 
    </button>`
    div.addEventListener('contextmenu', (e) => e.preventDefault())
    div.addEventListener('click', () => {
      map.setLayoutProperty('water', 'visibility', 'none')
      map.setLayoutProperty('water-offset', 'visibility', 'none')
      hideWater = true
    })
    this.container = div
    this.map = map
    return div
  }
  onRemove() {
    if (this.container) this.container.parentNode?.removeChild(this.container)
    if (this.map) this.map = undefined
  }
}
/**
 * Main Maptorium class to control maplibre-gl
 */
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

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
      }),
      'top-left'
    )

    map.addControl(new maplibregl.GlobeControl(), 'top-left')

    //Add custom button to center my by GPS
    const myGPSControl = new GPSToCenterButton()
    map.addControl(myGPSControl, 'top-left')

    //Add custom button to show/hide water polygone
    const myWaterControl = new HideWaterButton()
    map.addControl(myWaterControl, 'top-left')

    //Handle context menu for map
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
    gpsPosition.center = [lng, lat]
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
      const jsonStyle = (await request(`styles/${style}/style.json`)) as
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
  private async _updateMapStyle() {
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
        sprite: `http://localhost/styles/${this._extendStyleID}/sprite`,
        glyphs: 'styles/fonts/{fontstack}/{range}.pbf',
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#f8f4f0' }
          }
        ],
        sky: {
          'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0]
        }
        //id: 'MAPTORIUM'
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
            pixel_scale: '512'
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
          tiles: [`tile/${this._baseMap.id}/{z}/{x}/{y}.pbf`],
          minzoom: 0,
          maxzoom: 14,
          format: 'pbf',
          pixel_scale: '256'
        }
        anyVectorMap = true
      }

      if (this._extendStyle && anyVectorMap) {
        //Add extend style for vector tiles
        for (let cL = 0; cL < this._extendStyle.layers.length; cL++) {
          const item = this._extendStyle.layers[cL]
          mainStyle.layers.push(item)
          //Set style for map
          // this._map.setStyle(mainStyle)
          // console.log(cL)
          // await wait(200)
        }
      }
      mainStyle.layers.forEach((value, index) => {
        if (value['source-layer'] == 'water' && hideWater == true) {
          mainStyle.layers[index].layout.visibility = 'none'
        }
      })
      //console.log(mainStyle)
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
