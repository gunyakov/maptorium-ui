import Geometry from './Geometry'
class Point extends Geometry {
  private _markerJson = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    },
    properties: {
      title: ''
    }
  }
  // Create a GeoJSON source with an empty lineString.
  private _geojson = {
    type: 'FeatureCollection',
    features: [this._markerJson]
  }

  private _showText = false

  public showText() {
    this._showText = true
  }
  public hideText() {
    this._showText = false
  }

  protected _draw() {
    if (this._sID.length == 0) this._sID = 'MPoint' + this._id.toString()
    this._geojson.features = []
    for (let i = 0; i < this._points.length; i++) {
      const point = this._points[i]
      if (this._properties[i]) {
        this._markerJson.properties.title = this._properties[i]
      }
      const newPoint = { ...this._markerJson }
      newPoint.geometry.coordinates = point
      this._geojson.features.push(newPoint)
    }
    if (this._map) {
      const source = this._map.getSource(this._sID)
      if (source) {
        //@ts-ignore
        source.setData(this._geojson)
      } else {
        this._map.addSource(this._sID, {
          type: 'geojson',
          //@ts-ignore
          data: this._geojson
        })
        this._map.addLayer({
          id: this._sID,
          source: this._sID,
          type: 'circle',
          paint: {
            'circle-color': this._options.fillColor,
            'circle-radius': this._options.radius,
            'circle-opacity': this._options.fillOpacity,
            'circle-stroke-width': this._options.width,
            'circle-stroke-color': this._options.color
          }
        })
        // if (this._showText) {
        //   this._map.addLayer({
        //     id: this._sID + '-text',
        //     source: this._sID,
        //     type: 'symbol',
        //     layout: {
        //       'text-field': ['get', 'title'],
        // 'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        // 'text-offset': [0, 0.6],
        // 'text-anchor': 'top'
        //     },
        //     paint: {
        //       'text-color': '#666',
        //       'text-halo-blur': 0.5,
        //       'text-halo-color': '#ffffff',
        //       'text-halo-width': 1
        //     }
        //   })
        // }
      }
    }
  }

  public hide() {
    if (this._map) {
      if (this._map.getLayer(this._sID)) this._map.removeLayer(this._sID)
      if (this._map.getSource(this._sID)) this._map.removeSource(this._sID)
    }
  }
}

export default Point
