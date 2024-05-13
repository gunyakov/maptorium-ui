import type { GPSCoords, Style } from '@/interface'
class Geometry {
  protected _map: maplibregl.Map | null = null
  protected _points: [[lng: number, lat: number]] = [[0, 0]]
  protected _options: Style = {
    color: '#007cbf',
    width: 4,
    fillColor: '#088',
    fillOpacity: 0.8,
    dasharray: [1],
    radius: 5,
    name: ''
  }

  protected _properties: Array<string> = []

  protected _id: number = 0
  protected _sID = ''
  constructor(map: maplibregl.Map | null, id?: number | string) {
    this._map = map
    if (typeof id == 'number') this._id = id
    else if (typeof id == 'string') this._sID = id
    else this._id = Date.now()
  }

  public Points(coords: Array<GPSCoords>, properties?: Array<string>) {
    //@ts-ignore
    this._points = []
    if (coords) {
      coords.forEach((value) => {
        this._points.push([value.lng, value.lat])
      })
      this._draw()
    }
    if (properties) this._properties = properties
  }

  public pushPoint(lat: number, lng: number) {
    if (lat && lng) {
      this._points.push([lng, lat])
      this._draw()
    }
  }
  protected _draw() {}

  public show() {
    this._draw()
  }

  public hide() {}
  public setStyle(options: Style | undefined) {
    if (options) {
      for (const key in options) {
        //@ts-ignore
        if (this._options[key] !== undefined) this._options[key] = options[key]
        //if (key == 'name') console.log(this._options[key], options[key])
      }
      //console.log(this._options)
    }
  }
}

export default Geometry
