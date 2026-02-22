<template>
  <div class="map-wrapper">
    <div id="map" class="map-container"></div>
    <DrawMeasureOverlay />
    <RouteHoverMeasureOverlay />
    <GPSinfo />
    <InfoBar />
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getMap } from 'src/map/Map';
import { useMapsList } from 'src/composables/useMapsList';
import InfoBar from 'src/components/InfoBar.vue';
import GPSinfo from 'src/components/GPSinfo.vue';
import DrawMeasureOverlay from 'src/components/DrawMeasureOverlay.vue';
import RouteHoverMeasureOverlay from 'src/components/RouteHoverMeasureOverlay.vue';
import Routes from 'src/API/Routes';
import { useRouteHistoryStore } from 'src/stores/routeHistory';
import { usePOIStore } from 'src/stores/poi';
import { useRouteHoverMeasure } from 'src/composables/useRouteHoverMeasure';
import { useSettingsStore } from 'src/stores/settings';
import { DistanceUnits } from 'src/enum';

const ROUTE_HISTORY_SOURCE_ID = 'gps-route-history-source';
const ROUTE_HISTORY_LAYER_MAIN_ID = 'gps-route-history-line-main';
const ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID = 'gps-route-history-line-hover-outline';
const ROUTE_HISTORY_LAYER_HOVER_MAIN_ID = 'gps-route-history-line-hover-main';
const NO_HOVER_ROUTE_ID = -1;

const routeHistory = useRouteHistoryStore();
const poiStore = usePOIStore();
const settingsStore = useSettingsStore();
const routeHoverMeasure = useRouteHoverMeasure();

const hoveredRouteID = ref<number | null>(null);
let mapRef: maplibregl.Map | null = null;
let unsubscribeRouteHistory: (() => void) | null = null;
let styleDataHandler: (() => void) | null = null;
let mouseMoveHandler: ((event: maplibregl.MapMouseEvent) => void) | null = null;
let mouseOutHandler: (() => void) | null = null;

function getDistanceUnitLabel(): string {
  const unitKey = settingsStore.units;
  if (unitKey === 'kilometer') return 'km';
  if (unitKey === 'mile') return 'mi';
  if (unitKey === 'meter') return 'm';
  if (unitKey === 'foot') return 'ft';
  if (unitKey === 'yard') return 'yd';
  return 'nmi';
}

function formatDistanceMeters(distanceMeters: number): string {
  const unitKey = settingsStore.units;
  const distanceUnitFactor = DistanceUnits[unitKey] ?? DistanceUnits.nmile;
  const value = distanceMeters / distanceUnitFactor;
  const digits = value >= 100 ? 1 : 2;
  return `${value.toFixed(digits)} ${getDistanceUnitLabel()}`;
}

function getRouteName(routeID: number): string {
  const route = Routes.routes.value.find((item) => item.ID === routeID);
  return route?.name ?? `Route ${routeID}`;
}

function setRouteHoverFilters(map: maplibregl.Map, routeID: number | null) {
  const activeRouteID = routeID ?? NO_HOVER_ROUTE_ID;
  if (map.getLayer(ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID)) {
    map.setFilter(ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID, ['==', 'routeID', activeRouteID]);
  }
  if (map.getLayer(ROUTE_HISTORY_LAYER_HOVER_MAIN_ID)) {
    map.setFilter(ROUTE_HISTORY_LAYER_HOVER_MAIN_ID, ['==', 'routeID', activeRouteID]);
  }
}

function setHoveredRoute(map: maplibregl.Map, routeID: number | null) {
  if (hoveredRouteID.value === routeID) return;
  hoveredRouteID.value = routeID;
  setRouteHoverFilters(map, routeID);

  if (routeID == null) {
    routeHoverMeasure.clear();
    map.getCanvas().style.cursor = '';
    return;
  }

  const routeData = routeHistory.byID(routeID);
  if (!routeData) {
    routeHoverMeasure.clear();
    map.getCanvas().style.cursor = '';
    return;
  }

  routeHoverMeasure.set({
    name: getRouteName(routeID),
    total: formatDistanceMeters(routeData.lengthMeters),
  });
  map.getCanvas().style.cursor = 'pointer';
}

function ensureRouteHistoryLayers(map: maplibregl.Map) {
  if (!map.getSource(ROUTE_HISTORY_SOURCE_ID)) {
    map.addSource(ROUTE_HISTORY_SOURCE_ID, {
      type: 'geojson',
      data: routeHistory.featureCollection,
    });
  }

  if (!map.getLayer(ROUTE_HISTORY_LAYER_MAIN_ID)) {
    map.addLayer({
      id: ROUTE_HISTORY_LAYER_MAIN_ID,
      type: 'line',
      source: ROUTE_HISTORY_SOURCE_ID,
      paint: {
        'line-color': poiStore.style.polygonColor,
        'line-width': 2,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    });
  }

  if (!map.getLayer(ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID)) {
    map.addLayer({
      id: ROUTE_HISTORY_LAYER_HOVER_OUTLINE_ID,
      type: 'line',
      source: ROUTE_HISTORY_SOURCE_ID,
      filter: ['==', 'routeID', NO_HOVER_ROUTE_ID],
      paint: {
        'line-color': '#ffffff',
        'line-width': 6,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    });
  }

  if (!map.getLayer(ROUTE_HISTORY_LAYER_HOVER_MAIN_ID)) {
    map.addLayer({
      id: ROUTE_HISTORY_LAYER_HOVER_MAIN_ID,
      type: 'line',
      source: ROUTE_HISTORY_SOURCE_ID,
      filter: ['==', 'routeID', NO_HOVER_ROUTE_ID],
      paint: {
        'line-color': poiStore.style.polygonColor,
        'line-width': 4,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    });
  }

  setRouteHoverFilters(map, hoveredRouteID.value);
}

function refreshRouteHistoryData(map: maplibregl.Map) {
  const source = map.getSource(ROUTE_HISTORY_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
  if (!source) return;
  source.setData(routeHistory.featureCollection);
}

const maps = useMapsList();
onMounted(async () => {
  await maps.refresh();
  const Map = getMap();
  const map = Map.init();
  mapRef = map;

  if (map) {
    const syncHistoryRouteLayer = () => {
      try {
        ensureRouteHistoryLayers(map);
        refreshRouteHistoryData(map);
      } catch {
        return;
      }
    };

    styleDataHandler = syncHistoryRouteLayer;
    syncHistoryRouteLayer();
    map.on('styledata', styleDataHandler);
    unsubscribeRouteHistory = routeHistory.$subscribe(() => {
      syncHistoryRouteLayer();
    });

    mouseMoveHandler = (event: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: [ROUTE_HISTORY_LAYER_MAIN_ID],
      });
      const routeIDValue = features[0]?.properties?.routeID;
      const routeID = typeof routeIDValue === 'number' ? routeIDValue : Number(routeIDValue);
      if (Number.isFinite(routeID)) {
        setHoveredRoute(map, routeID);
      } else {
        setHoveredRoute(map, null);
      }
    };

    mouseOutHandler = () => {
      setHoveredRoute(map, null);
    };

    map.on('mousemove', mouseMoveHandler);
    map.on('mouseout', mouseOutHandler);
  }

  Routes.refresh().catch((e) => {
    console.error(e.message);
  });
});

onBeforeUnmount(() => {
  if (mapRef && styleDataHandler) {
    mapRef.off('styledata', styleDataHandler);
  }
  if (mapRef && mouseMoveHandler) {
    mapRef.off('mousemove', mouseMoveHandler);
  }
  if (mapRef && mouseOutHandler) {
    mapRef.off('mouseout', mouseOutHandler);
  }
  if (unsubscribeRouteHistory) {
    unsubscribeRouteHistory();
  }
  routeHoverMeasure.clear();
});
</script>
<style lang="css" scoped>
.map-wrapper {
  position: relative;
  height: 100%;
}

.map-container {
  height: 100%;
  /* These two lines are still needed for iOS Safari */
  overflow-y: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
