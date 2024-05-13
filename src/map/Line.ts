import Geometry from './Geometry'
class Line extends Geometry {
  // Create a GeoJSON source with an empty lineString.
  private _geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0]]
        }
      }
    ]
  }

  protected _draw() {
    if (this._sID.length == 0) this._sID = 'MPolyline' + this._id.toString()
    this._geojson.features[0].geometry.coordinates = this._points
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
          type: 'line',
          paint: {
            'line-color': this._options.color,
            'line-width': this._options.width,
            'line-dasharray': this._options.dasharray
          }
        })
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

export default Line
