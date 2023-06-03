export enum MapType {
    map = "map",
    layer = "layer"
}

export enum ResponseType {
    success = "success",
    info = "info",
    warning = "warning",
    error = "error"
}

export enum EventType {
    init = "init",
    mapCenter = "map.center",
    mapChangeMap = "map.change",
    mapAddLayer = "map.layerAdd",
    mapRemoveLayer = "map.layerRemove",
    gpsCoords = "gps.update",
    routePoint = "route.point",
    routeHide = "route.hide",
    routeShow = "route.show",
    routeStartRecord = "route.start",
    routeStopRecord = "route.stop",
    historyShow = "history.show",
    historyHide = "history.hide"
}

export enum MapFormat {
    raster = "raster",
    vector = "vector"
}