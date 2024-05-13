import Geometry from './Geometry'

class Polygon extends Geometry {
  // Create a GeoJSON source with an empty lineString.
  private _geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0]]]
        },
        properties: { ID: 0 }
      }
    ]
  }

  protected _draw() {
    if (this._sID.length == 0) this._sID = 'MPolygon' + this._id.toString()
    this._geojson.features[0].geometry.coordinates[0] = this._points
    this._geojson.features[0].properties.ID = this._id
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
          type: 'fill',
          paint: {
            'fill-color': this._options.fillColor,
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5]
          }
        })
        this._map.addLayer({
          id: this._sID + '-outline',
          source: this._sID,
          type: 'line',
          paint: {
            'line-color': this._options.color,
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              this._options.width + 2,
              this._options.width
            ]
          }
        })
      }
    }
  }

  public hide() {
    if (this._map) {
      if (this._map.getLayer(this._sID)) this._map.removeLayer(this._sID)
      if (this._map.getLayer(this._sID + '-outline')) this._map.removeLayer(this._sID + '-outline')
      if (this._map.getSource(this._sID)) this._map.removeSource(this._sID)
    }
  }
}

export default Polygon
