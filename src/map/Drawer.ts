import { POIType } from '@/enum'
import type { GPSCoords, POIInfo } from '@/interface'
import Line from '@/map/Line'
import Point from './Point'
import Polygon from './Polygon'
import { ref } from 'vue'
import type { Ref } from 'vue'
//@ts-ignore
import * as turf from '@turf/turf'

class MAPTORIUMDRAWER {
  private _line: Line | null = null
  private _nextLine: Line | null = null
  private _polygon: Polygon | null = null
  private _points: Array<GPSCoords> = []
  private _mapWasMoved = false
  private _marker: Point | null = null
  private _map: maplibregl.Map | null = null
  private _geometryType: POIType = POIType.polyline
  private _distance: Ref<Array<number>> = ref([0])
  private _lastDrawTime = 0

  private _options = {
    color: '#007cbf',
    width: 2,
    fillColor: '#088',
    fillOpacity: 0.7,
    'line-dasharray': [3, 2]
  }

  constructor() {
    this._mousemove = this._mousemove.bind(this)
    this._mouseup = this._mouseup.bind(this)
    this._movestart = this._movestart.bind(this)
  }
  /**
   * Get map and init styles for polyline and line
   * @param map - maplibre Map
   */
  public addOn(map: maplibregl.Map) {
    this._map = map
    //Make new line
    this._line = new Line(map, 'MDrawerLine')
    this._line.setStyle({
      color: this._options['color'],
      width: this._options['width']
    })
    //Next line from last point to current mouse coords
    this._nextLine = new Line(map, 'MDrawerLineNext')
    this._nextLine.setStyle({
      color: this._options['color'],
      width: this._options['width'],
      dasharray: [3, 1, 1, 1]
    })
    //Make mouse coursor
    this._marker = new Point(this._map, 'DrawerMarker')
    this._marker.showText()
    //Make polygon
    this._polygon = new Polygon(this._map, 'DrawerPolygon')
    this._polygon.setStyle({ width: 2 })
  }
  /**
   * Start painting
   */
  public start(type: POIType) {
    this._geometryType = type
    //Reset points
    this._points = []
    //Clean distance table
    this._distance.value = [0]
    if (this._map) {
      //Switch on events
      this._map.on('mousemove', this._mousemove)
      this._map.on('movestart', this._movestart)
      this._map.on('mouseup', this._mouseup)
    }

    this._line?.show()
    this._nextLine?.show()
    this._polygon?.show()
  }
  /**
   * Stop painting
   */
  public stop() {
    if (this._map) {
      //Swith off events
      this._map.off('mousemove', this._mousemove)
      this._map.off('mouseup', this._mouseup)
      this._map.off('movestart', this._movestart)
    }
    //Remove mouse pointer layer from map
    this._marker?.hide()
    //Hide polyline
    this._nextLine?.hide()
    //Clean points from polyline
    this._nextLine?.Points([])
    //Hide line
    this._line?.hide()
    //Clean points from line
    this._line?.Points([])
    //Hide polygon
    this._polygon?.hide()
    //Clean points from polygon
    this._polygon?.Points([])
  }
  /**
   *
   * @returns Return POI info sutable to save on server
   */
  public save() {
    //If geometry is polygon, need copy first point to last, to close
    if (this._geometryType == POIType.polygon) this._points.push(this._points[0])
    const data: POIInfo = {
      name: 'Unknown POI',
      ID: 0,
      categoryID: 1,
      visible: 1,
      type: this._geometryType == POIType.square ? POIType.polygon : this._geometryType,
      color: this._options.color,
      fillColor: this._options.fillColor,
      fillOpacity: this._options.fillOpacity,
      width: this._options.width,
      points: this._points
    }
    return data
  }
  /**
   * Handle mouse move event
   * @param e - MouseEvent + latLng object
   */
  private _mousemove(e: MouseEvent) {
    if (!this._mapWasMoved) {
      if (Date.now() - this._lastDrawTime > 200) {
        //@ts-ignore
        this._drawNext(e.lngLat.lat, e.lngLat.lng)
        this._lastDrawTime = Date.now()
      }
    }
  }
  /**
   * Handle mouse up event
   * @param e - MouseEvent + latLng object
   */
  private _mouseup(e: MouseEvent) {
    if (!this._mapWasMoved) {
      //@ts-ignore
      this._points.push({ lat: e.lngLat.lat, lng: e.lngLat.lng })
      const distance =
        Math.floor(
          turf.distance(
            [this._points[this._points.length - 1].lng, this._points[this._points.length - 1].lat],
            //@ts-ignore
            [e.lngLat.lng, e.lngLat.lat],
            {
              units: 'meters'
            }
          ) * 100
        ) / 100
      if (this._points.length > 1) {
        this._distance.value.push(distance)
      } else {
        this._distance.value[0] = distance
      }

      this._draw()
    }
    this._mapWasMoved = false
  }
  /**
   * Handle map move start event
   */
  private _movestart() {
    this._mapWasMoved = true
  }
  /**
   * Draw line from last point to current mouse marker
   * @param lat - Latitude
   * @param lng - Longutide
   */
  private _drawNext(lat: number, lng: number) {
    //Update coords for mouse coursor
    this._marker?.Points([{ lat, lng }], ['0ml'])
    //If there are points in array
    if (this._points.length > 0) {
      //Get last point
      const lastPoint = this._points[this._points.length - 1]
      const distance =
        Math.floor(
          turf.distance([lastPoint.lng, lastPoint.lat], [lng, lat], {
            units: 'meters'
          }) * 100
        ) / 100
      this._distance.value[this._distance.value.length - 1] = distance
      const point2: GPSCoords = { lat: lat, lng: lastPoint.lng }
      const point4: GPSCoords = { lat: lastPoint.lat, lng: lng }

      switch (this._geometryType) {
        case POIType.polyline:
          //Draw line from last point to current mouse point
          this._nextLine?.Points([lastPoint, { lat, lng }])
          break
        case POIType.square:
          this._polygon?.Points([lastPoint, point2, { lat, lng }, point4, lastPoint])
          break
        case POIType.polygon:
          if (this._points.length > 1) {
            const firstPoint = this._points[0]
            //Draw line from last point to current mouse point
            this._nextLine?.Points([firstPoint, { lat, lng }, lastPoint])
          } else {
            //Draw line from last point to current mouse point
            this._nextLine?.Points([lastPoint, { lat, lng }])
          }
          break
      }
    }
  }
  /**
   * Draw polyline from first to last clicked position
   */
  private _draw() {
    if (this._points.length > 1 && this._geometryType == POIType.polyline) {
      this._line?.Points(this._points)
    }
    if (this._geometryType == POIType.polygon) {
      if (this._points.length > 1) {
        this._line?.Points(this._points)
      }
      if (this._points.length > 2) {
        this._polygon?.Points([
          ...this._points,
          { lng: this._points[0].lng, lat: this._points[0].lat }
        ])
        this._line?.hide()
      }
    }
  }

  public get distance() {
    return this._distance
  }
}

const Drawer = new MAPTORIUMDRAWER()
export default Drawer
