# maptorium-ui

Frontend part. All common JS code to use in UI interface. No JQuery or Leaflet dependency. Created to have ability in future to change map engine without rewriting core functions.

### Data Interfaces
##### Map List
```
    id: string,
    type: MapType,
    name: string,
    tilesize: number,
    attribution: string,
    content: string,
    format: MapFormat,
    submenu: string
```
##### GPS Coords 
```
    lat: number,
    lng: number,
    dir: number
```
##### Polygon/Polyline Options
```
    name: string, 
    color: string, 
    fillColor: string, 
    fillOpacity: number, 
    width: number
```
### UI Events

UI events handled with .on function and callback.

Example:

```
MUI.on("init", async function(mapsList, layersList) {
    //Your code
});
```
| Event | Params in callback | Description |
|-|-|-|
| init | mapsList: Array<[MapList](#map-list)>, layersList: Array<[MapList](#map-list)> | fired after init() function finish execution. |
| map.center | lat: number, lng: number, zoom: number | fired when need to move map to specific point. Executed when default config get from server |
| map.change | mapID: string, currentMapID: string | fired when user click on map menu to change main map. mapID - map what need to show. currentMapID - map what need to hide. |
| map.layerAdd | layerID: string | fired when user click on layers menu to add one overlay to map |
| map.layerRemove | layerID: string | fired when user click on layers menu to hide one layer from map |
| gps.update | lat: number, lng: number, dir: number | fired when UI get new current GPS coords from server |
| route.point | lat: number, lng: number | fired when server save new route point | 
| route.hide | void | fired when user whant to hide route from map. No parameters. |
| route.show | points: Array<[GPSCoords](#gps-coords)> | fired when user whant to show route on map. |
| draw.polygon | points: Array<[GPSCoords](#gps-coords)>, ID: number, options: [PolygonOptions](#polygonpolyline-options) | fired to draw new polygon on map |
| draw.polyline | points: Array<[GPSCoords](#gps-coords)>, ID: number, options: [PolylineOptions](#polygonpolyline-options) | fired to draw new polyline on map |