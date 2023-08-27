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
    historyHide = "history.hide",
    historyPoint = "history.point",
    addPolygon = "add.polygon",
    addPolyline = "add.polyline",
    addPoint = "add.point",
    savePoi = "poi.save",
    savePoiNew = "poi.savenew",
    cachedTileMap = "cachedtile.map",
    cachedTileMapClean = "cachedtile.clean",
    cachedTileMapTile = "cachedtile.tile",
    startPolyline = "start.polyline",
    stopPolyline = "stop.polyline",
    savePolyline = "save.polyline",
    startPolygon = "start.polygon",
    stopPolygon = "stop.polygon",
    savePolygon = "save.polygon",
    startSquare = "start.square",
    stopSquare = "stop.square",
    saveSquare = "save.square"
}

export enum MapFormat {
    raster = "raster",
    vector = "vector"
}

export enum POIType {
    point = "point",
    polygon = "polygon",
    polyline = "polyline",
    square = "square"
}

export enum LogType {
    info = "info",
    warning = "warning",
    error = "error",
    success = "success"
}

export enum LogModules {
    main = "MAIN",
    tstor = "TSTOR",
    map = "MAP",
    sqlite3 = "SQLITE3",
    http = "HTTP",
    gps = "GPS",
    poi = "POI",
    worker = "WORKER"
}

export enum DownloadMode {
    enable = "enable",
    disable = "disable",
    force = "force"
}

export enum TileInCache {
    missing = "missing",
    present = "present",
    empty = "empty"
}

export enum JobType {
    download = "download",
    generate = "generate"
}