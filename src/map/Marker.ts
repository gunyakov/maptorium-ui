import Geometry from './Geometry'
import { Marker } from 'maplibre-gl'
class MAPTORIUMMARKER extends Geometry {
  private _marker: maplibregl.Marker | null = null

  // Create a GeoJSON source with an empty lineString.
  private _geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: { ID: 0, name: '' }
      }
    ]
  }

  protected async _draw() {
    if (this._sID.length == 0) this._sID = 'MMarker' + this._id.toString()
    this._geojson.features[0].geometry.coordinates = this._points[0]
    this._geojson.features[0].properties.ID = this._id
    if (this._options.name) this._geojson.features[0].properties.name = this._options.name
    if (this._map) {
      const source = this._map.getSource(this._sID)
      if (source) {
        //@ts-ignore
        source.setData(this._geojson)
      } else {
        // if (!this._map.getImage('standart-marker')) {
        //   const image = await this._map.loadImage('assets/images/marker.svg')
        //   console.log(image)
        //   this._map.addImage('standart-marker', image.data)
        // }
        this._map.addSource(this._sID, {
          type: 'geojson',
          //@ts-ignore
          data: this._geojson
        })
        //console.log(this._geojson)
        this._map.addLayer({
          id: this._sID,
          source: this._sID,
          type: 'symbol',
          layout: {
            //'icon-image': 'zoo',
            //'text-field': ['get', 'name'],
            'text-field': '{name}',
            'text-font': ['Noto Sans Regular'],
            'text-offset': [0, 1.25],
            'text-anchor': 'top',
            visibility: 'visible',
            'text-size': {
              base: 1.2,
              stops: [
                [7, 14],
                [11, 24]
              ]
            }
          },
          paint: {
            'text-color': '#333',
            'text-halo-color': 'rgba(255,255,255,0.8)',
            'text-halo-width': 1.2
          }
        })
      }
      if (!this._marker) {
        this._marker = new Marker()
        this._marker.setLngLat(this._points[0])
        this._marker.addTo(this._map)
      }
      this._marker.setLngLat(this._points[0])
    }
  }

  public hide() {
    if (this._map) {
      if (this._marker) {
        this._marker.remove()
        this._marker = null
      }
      if (this._map.getLayer(this._sID)) this._map.removeLayer(this._sID)
      if (this._map.getSource(this._sID)) this._map.removeSource(this._sID)
    }
  }
}

export default MAPTORIUMMARKER
