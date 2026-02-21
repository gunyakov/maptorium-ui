import { t } from 'src/i18n';
import { usePOIStore } from 'src/stores/poi';
import { useSettingsStore } from 'src/stores/settings';
import { useDrawMeasure } from 'src/composables/useDrawMeasure';
import EPSG3857 from 'src/helpers/EPSG3857';
import type { Feature, GeoJsonProperties, Geometry, Polygon, Position } from 'geojson';
import { DistanceUnits, SquareUnits } from 'src/enum';
import * as turf from '@turf/turf';
import { ref } from 'vue';

export type DrawMenuItem = 'point' | 'polyline' | 'polygon' | 'tile_square';

export const activeDrawMenuItem = ref<DrawMenuItem | null>(null);

type DrawerControlsMode = 'hidden' | 'draw' | 'modify';
type ModifyMode = 'move' | 'edit';
type DrawFeatureId = string | number;
type SquareUnitKey = keyof typeof SquareUnits;
type DistanceUnitKey = keyof typeof DistanceUnits;

const POI_SOURCE_ID = 'poi-drawings-source';
const POI_LAYER_POLYGON_FILL = 'poi-polygon-fill';
const POI_LAYER_POLYGON_LINE = 'poi-polygon-line';
const POI_LAYER_LINE = 'poi-line';
const POI_LAYER_POINT = 'poi-point';
const POI_LAYER_POLYGON_HOVER_OUTLINE = 'poi-polygon-hover-outline';
const POI_LAYER_POLYGON_HOVER_MAIN = 'poi-polygon-hover-main';
const POI_LAYER_LINE_HOVER_OUTLINE = 'poi-line-hover-outline';
const POI_LAYER_LINE_HOVER_MAIN = 'poi-line-hover-main';
const POI_LAYER_POINT_HOVER_OUTLINE = 'poi-point-hover-outline';
const POI_LAYER_POINT_HOVER_MAIN = 'poi-point-hover-main';
const POI_HOVER_ID_PROPERTY = '__poi_id';
const MEASURE_VERTEX_SOURCE_ID = 'measure-vertex-source';
const MEASURE_VERTEX_CIRCLE_LAYER_ID = 'measure-vertex-circle';
const MEASURE_VERTEX_LABEL_LAYER_ID = 'measure-vertex-label';
const TILE_SQUARE_PREVIEW_SOURCE_ID = 'tile-square-preview-source';
const TILE_SQUARE_PREVIEW_FILL_LAYER_ID = 'tile-square-preview-fill';
const TILE_SQUARE_PREVIEW_LINE_LAYER_ID = 'tile-square-preview-line';

class Drawer implements maplibregl.IControl {
  private _map: maplibregl.Map | undefined = undefined;
  private _container: HTMLDivElement | undefined = undefined;
  private _contextMenu: HTMLDivElement | undefined = undefined;
  private _draw: MapboxDrawInstance | undefined = undefined;
  private _onDrawModeChange: ((e?: unknown) => void) | undefined = undefined;
  private _onDrawSelectionChange: ((e?: unknown) => void) | undefined = undefined;
  private _onStyleData: (() => void) | undefined = undefined;
  private _onCanvasMouseDown: ((e: MouseEvent) => void) | undefined = undefined;
  private _onCanvasContextMenu: ((e: MouseEvent) => void) | undefined = undefined;
  private _onMapLeftClick: ((e?: unknown) => void) | undefined = undefined;
  private _onMapMouseMove: ((e?: unknown) => void) | undefined = undefined;
  private _onMapMouseOut: (() => void) | undefined = undefined;
  private _onMapLoad: (() => void) | undefined = undefined;
  private _unsubscribePOIStore: (() => void) | undefined = undefined;
  private _saveButton: HTMLButtonElement | undefined = undefined;
  private _deleteButton: HTMLButtonElement | undefined = undefined;
  private _hoveredFeatureId: DrawFeatureId | null = null;
  private _controlsMode: DrawerControlsMode = 'hidden';
  private _modifyMode: ModifyMode | null = null;
  private _modifyFeatureId: DrawFeatureId | null = null;
  private _modifyOriginalFeature: Feature<Geometry, GeoJsonProperties> | null = null;
  private _tileSquarePreview: Feature<Polygon, GeoJsonProperties> | null = null;
  private _tileSquareSize = 256;

  onAdd(map: maplibregl.Map): HTMLElement {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    this._container.style.display = 'none';

    this._contextMenu = document.createElement('div');
    this._contextMenu.style.position = 'absolute';
    this._contextMenu.style.zIndex = '5';
    this._contextMenu.style.display = 'none';
    this._contextMenu.style.minWidth = '180px';
    this._contextMenu.style.background = '#fff';
    this._contextMenu.style.borderRadius = '4px';
    this._contextMenu.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    this._contextMenu.style.padding = '4px 0';
    this._contextMenu.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    this._saveButton = document.createElement('button');
    this._saveButton.type = 'button';
    this._saveButton.className = 'maplibregl-ctrl-icon';
    this._saveButton.title = t('menu.draw.controls.save');
    this._saveButton.ariaLabel = t('menu.draw.controls.save');
    this._saveButton.innerHTML =
      '<span class="material-icons" style="font-size:18px;line-height:29px;">save</span>';
    this._protectControlButton(this._saveButton);

    this._deleteButton = document.createElement('button');
    this._deleteButton.type = 'button';
    this._deleteButton.className = 'maplibregl-ctrl-icon';
    this._deleteButton.title = t('menu.draw.controls.delete');
    this._deleteButton.ariaLabel = t('menu.draw.controls.delete');
    this._deleteButton.innerHTML =
      '<span class="material-icons" style="font-size:18px;line-height:29px;">delete</span>';
    this._protectControlButton(this._deleteButton);

    this._container.appendChild(this._saveButton);
    this._container.appendChild(this._deleteButton);

    if (typeof window.MapboxDraw === 'function') {
      const poiStore = usePOIStore();
      this._draw = new window.MapboxDraw({
        displayControlsDefault: false,
        styles: this._buildDrawStyles(poiStore),
      });
      this._map.addControl(this._draw, 'top-right');
      this._map.getContainer().appendChild(this._contextMenu);

      this._syncPOILayersAndData();
      this._setHoveredFeatureId(null);

      this._onStyleData = () => {
        this._syncPOILayersAndData();
        this._ensureTileSquarePreviewLayers();
        this._refreshTileSquarePreview();
        this._setHoveredFeatureId(this._hoveredFeatureId);
        this._refreshMeasurementOverlay();
      };
      this._map.on('styledata', this._onStyleData);

      this._onMapLoad = () => {
        this._syncPOILayersAndData();
        this._ensureTileSquarePreviewLayers();
        this._refreshTileSquarePreview();
        this._refreshMeasurementOverlay();
      };
      this._map.on('load', this._onMapLoad);

      if (!this._unsubscribePOIStore) {
        this._unsubscribePOIStore = poiStore.$subscribe(() => {
          this._syncPOILayersAndData();
          this._refreshMeasurementOverlay();
        });
      }

      this._scheduleStartupSync();

      this._setDrawControlActions();

      this._onCanvasMouseDown = (event: MouseEvent) => {
        if (event.button === 2) {
          event.preventDefault();
        }
      };
      this._map
        .getCanvasContainer()
        .addEventListener('mousedown', this._onCanvasMouseDown, { capture: true });

      this._onCanvasContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this._hideContextMenu();

        if (activeDrawMenuItem.value != null || this._controlsMode === 'modify' || !this._map) {
          return;
        }

        const rect = this._map.getContainer().getBoundingClientRect();
        const point = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        const featureId = this._getFeatureIdAtPoint(point, true);
        if (!featureId) {
          return;
        }

        this._showContextMenu(featureId, event.clientX, event.clientY);
      };
      this._map
        .getCanvasContainer()
        .addEventListener('contextmenu', this._onCanvasContextMenu, { capture: true });

      this._onMapLeftClick = (event?: unknown) => {
        this._hideContextMenu();
        if (activeDrawMenuItem.value !== 'tile_square') return;
        const e = event as maplibregl.MapMouseEvent | undefined;
        if (!e?.lngLat) return;
        this._placeTileSquareToStore(e.lngLat);
      };
      this._map.on('click', this._onMapLeftClick);

      this._onMapMouseMove = (event?: unknown) => {
        if (!this._map) return;
        const e = event as { point?: { x: number; y: number } };
        if (!e.point) return;

        if (activeDrawMenuItem.value === 'tile_square') {
          const moveEvent = event as maplibregl.MapMouseEvent | undefined;
          if (moveEvent?.lngLat) {
            this._setTileSquarePreview(moveEvent.lngLat);
          }
          this._setHoveredFeatureId(null);
          this._map.getCanvas().style.cursor = 'crosshair';
          this._refreshMeasurementOverlay();
          return;
        }

        if (this._controlsMode === 'modify' && this._modifyMode === 'edit') {
          this._setHoveredFeatureId(null);
          const features = this._map.queryRenderedFeatures([e.point.x, e.point.y]);
          const hasEditHandle = features.some((feature) => {
            const layerId = feature.layer?.id ?? '';
            if (!layerId.startsWith('gl-draw-')) return false;
            const meta = feature.properties?.meta;
            return meta === 'vertex' || meta === 'midpoint';
          });
          this._map.getCanvas().style.cursor = hasEditHandle ? 'pointer' : '';
          this._refreshMeasurementOverlay();
          return;
        }

        if (this._controlsMode === 'modify' && this._modifyMode === 'move') {
          this._setHoveredFeatureId(null);
          const features = this._map.queryRenderedFeatures([e.point.x, e.point.y]);
          const hasFeature = features.some((feature) => {
            const layerId = feature.layer?.id ?? '';
            if (!layerId.startsWith('gl-draw-')) return false;
            return feature.properties?.meta === 'feature';
          });
          this._map.getCanvas().style.cursor = hasFeature ? 'pointer' : '';
          this._refreshMeasurementOverlay();
          return;
        }

        if (activeDrawMenuItem.value == null && this._controlsMode !== 'modify') {
          const hoverFeatureId = this._getHoverFeatureIdAtPoint(e.point, true);
          this._setHoveredFeatureId(hoverFeatureId);
          this._map.getCanvas().style.cursor = hoverFeatureId != null ? 'pointer' : '';
          this._refreshMeasurementOverlay();
          return;
        }

        this._setHoveredFeatureId(null);
        this._map.getCanvas().style.cursor = '';
        this._refreshMeasurementOverlay();
      };
      this._map.on('mousemove', this._onMapMouseMove);

      this._onMapMouseOut = () => {
        this._setHoveredFeatureId(null);
        if (this._map) {
          this._map.getCanvas().style.cursor = '';
        }
        this._refreshMeasurementOverlay();
      };
      this._map.on('mouseout', this._onMapMouseOut);

      this._onDrawModeChange = (event?: unknown) => {
        const mode = (event as { mode?: MapboxDrawMode } | undefined)?.mode;
        if (mode === 'direct_select' && this._controlsMode !== 'modify') {
          this._draw?.changeMode('simple_select');
          this._refreshMeasurementOverlay();
          return;
        }
        if (mode === 'draw_point' || mode === 'draw_line_string' || mode === 'draw_polygon') {
          this._setMenuStateByMode(mode);
          this._refreshMeasurementOverlay();
          return;
        }
        if (this._controlsMode === 'draw' && activeDrawMenuItem.value != null) {
          this._showDrawControls();
          this._refreshMeasurementOverlay();
          return;
        }
        if (this._controlsMode === 'draw') {
          this._resetDrawingState();
        }
        this._refreshMeasurementOverlay();
      };

      this._map.on('draw.modechange', this._onDrawModeChange);

      this._onDrawSelectionChange = (event?: unknown) => {
        const features = (event as { features?: unknown[] } | undefined)?.features ?? [];
        if (
          activeDrawMenuItem.value == null &&
          this._controlsMode !== 'modify' &&
          features.length > 0
        ) {
          this._draw?.changeMode('simple_select', { featureIds: [] });
        }
        this._refreshMeasurementOverlay();
      };
      this._map.on('draw.selectionchange', this._onDrawSelectionChange);
    } else {
      console.error('MapboxDraw is not available on window. Check vendor script loading.');
    }

    return this._container;
  }

  onRemove(): void {
    if (this._map && this._onCanvasMouseDown) {
      this._map
        .getCanvasContainer()
        .removeEventListener('mousedown', this._onCanvasMouseDown, { capture: true });
    }
    if (this._map && this._onCanvasContextMenu) {
      this._map
        .getCanvasContainer()
        .removeEventListener('contextmenu', this._onCanvasContextMenu, { capture: true });
    }
    if (this._map && this._onDrawModeChange) {
      this._map.off('draw.modechange', this._onDrawModeChange);
    }
    if (this._map && this._onDrawSelectionChange) {
      this._map.off('draw.selectionchange', this._onDrawSelectionChange);
    }
    if (this._map && this._onStyleData) {
      this._map.off('styledata', this._onStyleData);
    }
    if (this._map && this._onMapLeftClick) {
      this._map.off('click', this._onMapLeftClick);
    }
    if (this._map && this._onMapMouseMove) {
      this._map.off('mousemove', this._onMapMouseMove);
    }
    if (this._map && this._onMapMouseOut) {
      this._map.off('mouseout', this._onMapMouseOut);
    }
    if (this._map && this._onMapLoad) {
      this._map.off('load', this._onMapLoad);
    }
    this._setHoveredFeatureId(null);
    if (this._map && this._draw) {
      this._map.removeControl(this._draw);
    }
    if (this._contextMenu && this._contextMenu.parentNode) {
      this._contextMenu.parentNode.removeChild(this._contextMenu);
    }
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._draw = undefined;
    this._contextMenu = undefined;
    this._onDrawModeChange = undefined;
    this._onDrawSelectionChange = undefined;
    this._onStyleData = undefined;
    this._onCanvasMouseDown = undefined;
    this._onCanvasContextMenu = undefined;
    this._onMapLeftClick = undefined;
    this._onMapMouseMove = undefined;
    this._onMapMouseOut = undefined;
    this._onMapLoad = undefined;
    if (this._unsubscribePOIStore) {
      this._unsubscribePOIStore();
      this._unsubscribePOIStore = undefined;
    }
    this._saveButton = undefined;
    this._deleteButton = undefined;
    this._hoveredFeatureId = null;
    this._controlsMode = 'hidden';
    this._modifyMode = null;
    this._modifyFeatureId = null;
    this._modifyOriginalFeature = null;
    this._clearTileSquarePreview();
    this._map = undefined;
    activeDrawMenuItem.value = null;
  }

  public startPoint() {
    this._hideContextMenu();
    this._clearTileSquarePreview();
    this._draw?.deleteAll();
    this._draw?.changeMode('draw_point');
    activeDrawMenuItem.value = 'point';
    this._showDrawControls();
    this._ensureDrawControlsVisibleSoon();
    this._refreshMeasurementOverlay();
  }

  public startPolyline() {
    this._hideContextMenu();
    this._clearTileSquarePreview();
    this._draw?.deleteAll();
    this._draw?.changeMode('draw_line_string');
    activeDrawMenuItem.value = 'polyline';
    this._showDrawControls();
    this._ensureDrawControlsVisibleSoon();
    this._refreshMeasurementOverlay();
  }

  public startPolygon() {
    this._hideContextMenu();
    this._clearTileSquarePreview();
    this._draw?.deleteAll();
    this._draw?.changeMode('draw_polygon');
    activeDrawMenuItem.value = 'polygon';
    this._showDrawControls();
    this._ensureDrawControlsVisibleSoon();
    this._refreshMeasurementOverlay();
  }

  public startTileSquare() {
    this._hideContextMenu();
    this._draw?.deleteAll();
    this._draw?.changeMode('simple_select', { featureIds: [] });
    activeDrawMenuItem.value = 'tile_square';
    this._showDrawControls();
    if (this._map) {
      this._setTileSquarePreview(this._map.getCenter());
      this._map.getCanvas().style.cursor = 'crosshair';
    }
    this._ensureDrawControlsVisibleSoon();
    this._refreshMeasurementOverlay();
  }

  public restoreSavedDrawings() {
    this._syncPOILayersAndData();
    this._draw?.deleteAll();
    this._draw?.changeMode('simple_select', { featureIds: [] });
    this._refreshMeasurementOverlay();
  }

  private _setMenuStateByMode(mode: MapboxDrawMode) {
    if (mode === 'draw_point') {
      activeDrawMenuItem.value = 'point';
    } else if (mode === 'draw_line_string') {
      activeDrawMenuItem.value = 'polyline';
    } else if (mode === 'draw_polygon' && activeDrawMenuItem.value == null) {
      activeDrawMenuItem.value = 'polygon';
    }
    if (this._controlsMode === 'draw') {
      this._showDrawControls();
    }
    this._refreshMeasurementOverlay();
  }

  private _showDrawControls() {
    this._controlsMode = 'draw';
    this._setDrawControlActions();
    this._forceShowControls();
  }

  private _ensureDrawControlsVisibleSoon() {
    requestAnimationFrame(() => {
      if (this._controlsMode === 'draw' && activeDrawMenuItem.value != null) {
        this._showDrawControls();
      }
      setTimeout(() => {
        if (this._controlsMode === 'draw' && activeDrawMenuItem.value != null) {
          this._showDrawControls();
        }
      }, 0);
    });
  }

  private _showModifyControls() {
    this._controlsMode = 'modify';
    this._setModifyControlActions();
    this._forceShowControls();
  }

  private _forceShowControls() {
    if (!this._map || !this._container) return;
    const topRight = this._map.getContainer().querySelector('.maplibregl-ctrl-top-right');
    if (topRight && this._container.parentElement !== topRight) {
      topRight.appendChild(this._container);
    }
    this._container.style.display = 'block';
    this._container.style.visibility = 'visible';
    this._container.style.opacity = '1';
    this._container.style.pointerEvents = 'auto';
  }

  private _setDrawControlActions() {
    if (!this._saveButton || !this._deleteButton) return;
    this._saveButton.title = t('menu.draw.controls.save');
    this._saveButton.ariaLabel = t('menu.draw.controls.save');
    this._saveButton.innerHTML =
      '<span class="material-icons" style="font-size:18px;line-height:29px;">save</span>';
    this._saveButton.onclick = () => {
      this._saveDrawingSession();
    };

    this._deleteButton.title = t('menu.draw.controls.delete');
    this._deleteButton.ariaLabel = t('menu.draw.controls.delete');
    this._deleteButton.innerHTML =
      '<span class="material-icons" style="font-size:18px;line-height:29px;">delete</span>';
    this._deleteButton.onclick = () => {
      this._deleteDrawingSession();
    };
  }

  private _setModifyControlActions() {
    if (!this._saveButton || !this._deleteButton) return;
    this._saveButton.title = t('menu.draw.controls.save');
    this._saveButton.ariaLabel = t('menu.draw.controls.save');
    this._saveButton.innerHTML =
      '<span class="material-icons" style="font-size:18px;line-height:29px;">save</span>';
    this._saveButton.onclick = () => {
      this._saveModifySession();
    };

    this._deleteButton.title = t('menu.draw.controls.cancel');
    this._deleteButton.ariaLabel = t('menu.draw.controls.cancel');
    this._deleteButton.innerHTML =
      '<span class="material-icons" style="font-size:18px;line-height:29px;">close</span>';
    this._deleteButton.onclick = () => {
      this._cancelModifySession();
    };
  }

  private _saveDrawingSession() {
    const featuresBeforeModeChange = this._draw?.getAll().features ?? [];
    const mode = this._draw?.getMode();
    if (mode === 'draw_polygon' || mode === 'draw_line_string' || mode === 'draw_point') {
      this._draw?.changeMode('simple_select');
    }

    const featuresAfterModeChange = this._draw?.getAll().features ?? [];
    const features =
      featuresAfterModeChange.length > 0 ? featuresAfterModeChange : featuresBeforeModeChange;
    if (!features || features.length === 0) return;
    const featuresCopy = this._normalizeFeatureIds(
      features.map((item) => JSON.parse(JSON.stringify(item))),
    );
    this._assignDefaultPOINames(featuresCopy);

    const poiStore = usePOIStore();
    poiStore.setDrawings([...poiStore.drawings, ...featuresCopy]);
    this._syncPOILayersAndData();

    this._draw?.deleteAll();
    this._draw?.changeMode('simple_select', { featureIds: [] });
    this._resetDrawingState();
    this._refreshMeasurementOverlay();
  }

  private _deleteDrawingSession() {
    this._draw?.deleteAll();
    this._draw?.changeMode('simple_select', { featureIds: [] });
    this._resetDrawingState();
    this._refreshMeasurementOverlay();
  }

  private _setTileSquarePreview(lngLat: { lng: number; lat: number }) {
    if (!this._map) return;
    this._tileSquarePreview = this._buildTileSquareFeature(lngLat);
    this._refreshTileSquarePreview();
  }

  private _buildTileSquareFeature(lngLat: { lng: number; lat: number }) {
    const zoom = Math.ceil(this._map?.getZoom() ?? 0);
    const tileSize = this._tileSquareSize;
    const point = EPSG3857.latLngToPoint({ lat: lngLat.lat, lng: lngLat.lng }, zoom);

    const x1 = Math.floor(point.x / tileSize) * tileSize;
    const y1 = Math.floor(point.y / tileSize) * tileSize;

    const p1 = EPSG3857.pointToLatLng({ x: x1, y: y1 }, zoom);
    const p2 = EPSG3857.pointToLatLng({ x: x1 + tileSize, y: y1 }, zoom);
    const p3 = EPSG3857.pointToLatLng({ x: x1 + tileSize, y: y1 + tileSize }, zoom);
    const p4 = EPSG3857.pointToLatLng({ x: x1, y: y1 + tileSize }, zoom);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [p1.lng, p1.lat],
            [p2.lng, p2.lat],
            [p3.lng, p3.lat],
            [p4.lng, p4.lat],
            [p1.lng, p1.lat],
          ],
        ],
      },
      properties: {},
    } as Feature<Polygon, GeoJsonProperties>;
  }

  private _placeTileSquareToStore(lngLat: { lng: number; lat: number }) {
    this._setTileSquarePreview(lngLat);
    if (!this._tileSquarePreview) return;

    const feature = JSON.parse(JSON.stringify(this._tileSquarePreview)) as Feature<
      Geometry,
      GeoJsonProperties
    >;
    feature.properties = {
      ...(feature.properties ?? {}),
    };

    const normalized = this._normalizeFeatureIds([feature])[0];
    if (!normalized) return;
    this._assignDefaultPOINames([normalized]);

    const poiStore = usePOIStore();
    poiStore.addDrawing(normalized);
    this._syncPOILayersAndData();
    setTimeout(() => this._syncPOILayersAndData(), 0);
    setTimeout(() => this._syncPOILayersAndData(), 120);

    this._draw?.deleteAll();
    this._draw?.changeMode('simple_select', { featureIds: [] });
    this._resetDrawingState();
    this._refreshMeasurementOverlay();
  }

  private _ensureTileSquarePreviewLayers() {
    if (!this._map || !this._isStyleReady()) return;

    if (!this._map.getSource(TILE_SQUARE_PREVIEW_SOURCE_ID)) {
      this._map.addSource(TILE_SQUARE_PREVIEW_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    }

    if (!this._map.getLayer(TILE_SQUARE_PREVIEW_FILL_LAYER_ID)) {
      this._map.addLayer({
        id: TILE_SQUARE_PREVIEW_FILL_LAYER_ID,
        type: 'fill',
        source: TILE_SQUARE_PREVIEW_SOURCE_ID,
        paint: {
          'fill-color': '#9e9e9e',
          'fill-opacity': 0.35,
        },
      });
    }

    if (!this._map.getLayer(TILE_SQUARE_PREVIEW_LINE_LAYER_ID)) {
      this._map.addLayer({
        id: TILE_SQUARE_PREVIEW_LINE_LAYER_ID,
        type: 'line',
        source: TILE_SQUARE_PREVIEW_SOURCE_ID,
        paint: {
          'line-color': '#757575',
          'line-width': 2,
        },
      });
    }
  }

  private _refreshTileSquarePreview() {
    if (!this._map) return;
    this._ensureTileSquarePreviewLayers();
    const source = this._map.getSource(TILE_SQUARE_PREVIEW_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;

    if (activeDrawMenuItem.value === 'tile_square' && this._tileSquarePreview) {
      source.setData({
        type: 'FeatureCollection',
        features: [this._tileSquarePreview],
      });
      return;
    }

    source.setData({
      type: 'FeatureCollection',
      features: [],
    });
  }

  private _clearTileSquarePreview() {
    this._tileSquarePreview = null;
    this._refreshTileSquarePreview();
  }

  private _assignDefaultPOINames(features: Array<Feature<Geometry, GeoJsonProperties>>) {
    const poiStore = usePOIStore();
    features.forEach((feature) => {
      const existingName = feature.properties?.name;
      if (typeof existingName === 'string' && existingName.trim().length > 0) {
        return;
      }
      const generatedName = poiStore.nextPOIName(feature.geometry.type);
      if (!generatedName) return;
      feature.properties = {
        ...(feature.properties ?? {}),
        name: generatedName,
      };
    });
  }

  private _saveModifySession() {
    const editedFeature = this._draw?.getAll().features[0];
    if (editedFeature) {
      const poiStore = usePOIStore();
      const normalized = this._normalizeFeatureIds([JSON.parse(JSON.stringify(editedFeature))])[0];
      const originalId = this._modifyOriginalFeature?.id;
      if (normalized && originalId != null) {
        normalized.id = originalId;
      }
      if (normalized) {
        poiStore.setDrawings(
          poiStore.drawings.map((item) => (item.id === originalId ? normalized : item)),
        );
      }
    }
    this._syncPOILayersAndData();
    this._draw?.deleteAll();
    this._draw?.changeMode('simple_select', { featureIds: [] });
    this._finishModifySession();
    this._refreshMeasurementOverlay();
  }

  private _cancelModifySession() {
    this._draw?.deleteAll();
    this._draw?.changeMode('simple_select', { featureIds: [] });
    this._finishModifySession();
    this._refreshMeasurementOverlay();
  }

  private _finishModifySession() {
    if (this._map) {
      this._map.getCanvas().style.cursor = '';
    }
    this._setHoveredFeatureId(null);
    this._modifyMode = null;
    this._modifyFeatureId = null;
    this._modifyOriginalFeature = null;
    this._controlsMode = 'hidden';
    if (this._container) this._container.style.display = 'none';
    this._refreshMeasurementOverlay();
  }

  private _startModify(featureId: DrawFeatureId, mode: ModifyMode) {
    if (!this._draw) return;

    const storeFeature = this._getStoredFeatureById(featureId);
    if (!storeFeature) return;
    const feature = JSON.parse(JSON.stringify(storeFeature)) as Feature<
      Geometry,
      GeoJsonProperties
    >;
    feature.id = featureId;

    this._draw.deleteAll();
    const ids = this._draw.add(feature);
    const drawFeatureId = ids[0] ?? featureId;
    const drawFeature = this._draw.get(drawFeatureId);
    if (!drawFeature) return;

    this._modifyMode = mode;
    this._modifyFeatureId = drawFeatureId;
    this._modifyOriginalFeature = JSON.parse(JSON.stringify(storeFeature));

    this._hideContextMenu();
    this._showModifyControls();

    if (mode === 'edit' && drawFeature.geometry.type !== 'Point') {
      let coordPath: string | undefined = undefined;
      if (drawFeature.geometry.type === 'Polygon') {
        coordPath = '0.0';
      } else if (drawFeature.geometry.type === 'LineString') {
        coordPath = '0';
      }

      const options: MapboxDrawChangeModeOptions = { featureId: drawFeatureId };
      if (coordPath !== undefined) {
        options.coordPath = coordPath;
      }
      this._draw.changeMode('direct_select', options);
      this._refreshMeasurementOverlay();
      return;
    }
    this._draw.changeMode('simple_select', { featureIds: [drawFeatureId] });
    this._refreshMeasurementOverlay();
  }

  private _deleteFeature(featureId: DrawFeatureId) {
    const poiStore = usePOIStore();
    poiStore.setDrawings(poiStore.drawings.filter((item) => item.id !== featureId));
    this._syncPOILayersAndData();

    if (this._modifyFeatureId === featureId) {
      this._finishModifySession();
    }
    this._hideContextMenu();
    this._refreshMeasurementOverlay();
  }

  private _showContextMenu(featureId: DrawFeatureId, clientX: number, clientY: number) {
    if (!this._contextMenu || !this._map) return;
    this._contextMenu.innerHTML = '';
    const storeFeature = this._getStoredFeatureById(featureId);
    const geometryType = storeFeature?.geometry?.type;
    const canEditGeometry = geometryType === 'LineString' || geometryType === 'Polygon';

    this._contextMenu.appendChild(
      this._createContextMenuItem(t('menu.draw.context.move'), 'open_with', () => {
        this._startModify(featureId, 'move');
      }),
    );
    if (canEditGeometry) {
      this._contextMenu.appendChild(
        this._createContextMenuItem(t('menu.draw.context.edit'), 'edit', () => {
          this._startModify(featureId, 'edit');
        }),
      );
    }
    this._contextMenu.appendChild(
      this._createContextMenuItem(t('menu.draw.context.delete'), 'delete', () => {
        this._deleteFeature(featureId);
      }),
    );
    this._contextMenu.appendChild(this._createContextMenuSeparator());
    this._contextMenu.appendChild(
      this._createContextMenuItem(t('menu.draw.context.properties'), 'settings', () => {
        this._hideContextMenu();
      }),
    );

    const rect = this._map.getContainer().getBoundingClientRect();
    this._contextMenu.style.left = `${clientX - rect.left}px`;
    this._contextMenu.style.top = `${clientY - rect.top}px`;
    this._contextMenu.style.display = '';
  }

  private _createContextMenuItem(
    label: string,
    icon: string,
    action: () => void,
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'block';
    button.style.width = '100%';
    button.style.padding = '7px 12px';
    button.style.border = 'none';
    button.style.background = 'transparent';
    button.style.textAlign = 'left';
    button.style.cursor = 'pointer';
    button.style.fontSize = '13px';
    button.style.lineHeight = '18px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.gap = '8px';
    button.innerHTML = `<span class="material-icons" style="font-size:18px;line-height:18px;">${icon}</span><span>${label}</span>`;
    button.onmouseenter = () => {
      button.style.background = '#f5f5f5';
    };
    button.onmouseleave = () => {
      button.style.background = 'transparent';
    };
    button.onclick = () => {
      action();
      this._hideContextMenu();
    };
    return button;
  }

  private _createContextMenuSeparator(): HTMLDivElement {
    const separator = document.createElement('div');
    separator.style.height = '1px';
    separator.style.margin = '4px 0';
    separator.style.background = '#e0e0e0';
    return separator;
  }

  private _hideContextMenu() {
    if (this._contextMenu) {
      this._contextMenu.style.display = 'none';
    }
  }

  private _getFeatureIdAtPoint(
    point: { x: number; y: number },
    fromPOILayers = false,
  ): DrawFeatureId | null {
    if (!this._map) return null;
    const queryPoint = fromPOILayers
      ? ([
          [point.x - 4, point.y - 4],
          [point.x + 4, point.y + 4],
        ] as [[number, number], [number, number]])
      : ([point.x, point.y] as [number, number]);
    const features = this._map.queryRenderedFeatures(
      queryPoint,
      fromPOILayers
        ? {
            layers: [
              POI_LAYER_POLYGON_FILL,
              POI_LAYER_POLYGON_LINE,
              POI_LAYER_LINE,
              POI_LAYER_POINT,
              POI_LAYER_POLYGON_HOVER_MAIN,
              POI_LAYER_LINE_HOVER_MAIN,
              POI_LAYER_POINT_HOVER_MAIN,
            ],
          }
        : undefined,
    );
    for (const feature of features) {
      const layerId = feature.layer?.id ?? '';
      if (fromPOILayers) {
        if (!layerId.startsWith('poi-')) continue;
      } else {
        if (!layerId.startsWith('gl-draw-')) continue;
        const meta = feature.properties?.meta;
        if (meta !== 'feature') continue;
      }

      const id = feature.properties?.id;
      const hoverId = feature.properties?.[POI_HOVER_ID_PROPERTY];
      if (typeof hoverId === 'string' || typeof hoverId === 'number') return hoverId;
      if (typeof id === 'string' || typeof id === 'number') return id;
      if (typeof feature.id === 'string' || typeof feature.id === 'number') return feature.id;
    }
    return null;
  }

  private _getHoverFeatureIdAtPoint(
    point: { x: number; y: number },
    fromPOILayers = false,
  ): DrawFeatureId | null {
    if (!this._map) return null;
    const hitBox: [[number, number], [number, number]] = [
      [point.x - 4, point.y - 4],
      [point.x + 4, point.y + 4],
    ];
    const features = this._map.queryRenderedFeatures(
      hitBox,
      fromPOILayers
        ? {
            layers: [
              POI_LAYER_POLYGON_FILL,
              POI_LAYER_POLYGON_LINE,
              POI_LAYER_LINE,
              POI_LAYER_POINT,
              POI_LAYER_POLYGON_HOVER_MAIN,
              POI_LAYER_LINE_HOVER_MAIN,
              POI_LAYER_POINT_HOVER_MAIN,
            ],
          }
        : undefined,
    );
    for (const feature of features) {
      const layerId = feature.layer?.id ?? '';
      if (fromPOILayers) {
        if (!layerId.startsWith('poi-')) continue;
      } else {
        if (!layerId.startsWith('gl-draw-')) continue;
        const meta = feature.properties?.meta;
        if (meta !== 'feature') continue;
      }
      const geometryType = feature.geometry?.type;
      if (geometryType !== 'LineString' && geometryType !== 'Polygon' && geometryType !== 'Point')
        continue;

      const hoverId = feature.properties?.[POI_HOVER_ID_PROPERTY];
      if (typeof hoverId === 'string' || typeof hoverId === 'number') return hoverId;
      const id = feature.properties?.id;
      if (typeof id === 'string' || typeof id === 'number') return id;
      if (typeof feature.id === 'string' || typeof feature.id === 'number') return feature.id;
    }
    return null;
  }

  private _setHoveredFeatureId(next: DrawFeatureId | null) {
    if (this._hoveredFeatureId === next) {
      return;
    }

    this._hoveredFeatureId = next;
    this._applyHoverLayerFilters(next);
    this._refreshMeasurementOverlay();
  }

  private _refreshMeasurementOverlay() {
    const drawMeasure = useDrawMeasure();

    const feature = this._getMeasurementTargetFeature();
    if (!feature) {
      drawMeasure.clear();
      this._refreshMeasurementVertices(null, []);
      return;
    }

    const geometryType = feature.geometry.type;
    const featureName = this._getFeatureName(feature);
    if (geometryType === 'Point') {
      if (!featureName) {
        drawMeasure.clear();
        this._refreshMeasurementVertices(null, []);
        return;
      }
      drawMeasure.set({
        name: featureName,
        segments: [],
        total: '',
      });
      this._refreshMeasurementVertices(null, []);
      return;
    }

    if (geometryType !== 'LineString' && geometryType !== 'Polygon') {
      drawMeasure.clear();
      this._refreshMeasurementVertices(null, []);
      return;
    }

    const vertices = this._extractVertices(feature);
    if (vertices.length < 2) {
      drawMeasure.clear();
      this._refreshMeasurementVertices(null, []);
      return;
    }

    const segments = this._buildSegments(vertices, geometryType === 'Polygon');
    if (segments.length === 0) {
      drawMeasure.clear();
      this._refreshMeasurementVertices(null, []);
      return;
    }

    const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);

    let areaValue: string | null = null;
    let areaRecords: Array<{ label: string; value: string }> = [];
    if (geometryType === 'Polygon') {
      const areaSquareMeters = this._computePolygonAreaSquareMeters(feature);
      const currentDistanceUnit = this._getDistanceUnitKey();
      areaValue = this._formatAreaByDistanceUnit(areaSquareMeters, currentDistanceUnit);
      areaRecords = this._getAdditionalSquareUnitKeys().map((unitKey) => ({
        label: `${t('menu.draw.measure.area')} (${t(`distance.square_units.${String(unitKey)}`)})`,
        value: this._formatAreaByUnit(areaSquareMeters, unitKey),
      }));
    }

    const segmentRows = segments.map((segment) => ({
      label: segment.label,
      value: this._formatDistance(segment.distance),
    }));

    drawMeasure.set({
      name: featureName || null,
      segments: segmentRows,
      total: this._formatDistance(totalDistance),
      area: areaValue,
      areas: areaRecords,
    });

    this._refreshMeasurementVertices(feature, vertices);
  }

  private _getFeatureName(feature: Feature<Geometry, GeoJsonProperties>): string {
    const value = feature.properties?.name;
    if (typeof value === 'string') {
      const normalized = value.trim();
      if (normalized.length > 0) return normalized;
    }
    return '';
  }

  private _refreshMeasurementVertices(
    feature: Feature<Geometry, GeoJsonProperties> | null,
    vertices: Position[],
  ) {
    if (!this._map) return;

    let source = this._map.getSource(MEASURE_VERTEX_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source && this._isStyleReady()) {
      this._ensurePOILayers();
      source = this._map.getSource(MEASURE_VERTEX_SOURCE_ID) as
        | maplibregl.GeoJSONSource
        | undefined;
    }
    if (!source) return;

    const labelFeatures: Array<Feature<Geometry, GeoJsonProperties>> = [];
    vertices.forEach((vertex, index) => {
      const labelPoint = this._getVertexLabelCoordinate(feature, vertices, index);
      const lng = labelPoint[0];
      const lat = labelPoint[1];
      if (typeof lng !== 'number' || typeof lat !== 'number') return;
      labelFeatures.push({
        type: 'Feature',
        properties: {
          index: String(index),
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      });
    });

    source.setData({
      type: 'FeatureCollection',
      features: labelFeatures,
    });
  }

  private _getVertexLabelCoordinate(
    feature: Feature<Geometry, GeoJsonProperties> | null,
    vertices: Position[],
    index: number,
  ): Position {
    const base = vertices[index];
    if (!base) return [0, 0];

    const direction = this._getVertexLabelDirection(feature, vertices, index);
    const offsetMeters = 12;
    let candidate = this._offsetCoordinateByDirection(base, direction, offsetMeters);

    if (feature && feature.geometry.type === 'Polygon') {
      if (this._pointInsidePolygon(candidate, feature as Feature<Polygon, GeoJsonProperties>)) {
        const reverseDirection = { x: -direction.x, y: -direction.y };
        const reversed = this._offsetCoordinateByDirection(base, reverseDirection, offsetMeters);
        if (!this._pointInsidePolygon(reversed, feature as Feature<Polygon, GeoJsonProperties>)) {
          candidate = reversed;
        }
      }
    }

    return candidate;
  }

  private _getVertexLabelDirection(
    feature: Feature<Geometry, GeoJsonProperties> | null,
    vertices: Position[],
    index: number,
  ): { x: number; y: number } {
    const current = vertices[index];
    if (!current) return { x: 0, y: 1 };

    if (feature && feature.geometry.type === 'Polygon' && vertices.length > 2) {
      const polygon = feature as Feature<Polygon, GeoJsonProperties>;
      const centroid = turf.centroid(polygon).geometry.coordinates;
      const fromCenter = this._normalizeVector(this._localVector(centroid, current));

      const prev = vertices[(index - 1 + vertices.length) % vertices.length];
      const next = vertices[(index + 1) % vertices.length];
      const toPrev = prev
        ? this._normalizeVector(this._localVector(current, prev))
        : { x: 0, y: 0 };
      const toNext = next
        ? this._normalizeVector(this._localVector(current, next))
        : { x: 0, y: 0 };
      const outsideBisector = this._normalizeVector({
        x: -(toPrev.x + toNext.x),
        y: -(toPrev.y + toNext.y),
      });

      const combined = this._normalizeVector({
        x: fromCenter.x + outsideBisector.x,
        y: fromCenter.y + outsideBisector.y,
      });

      if (this._vectorLength(combined) > 0) return combined;
      if (this._vectorLength(fromCenter) > 0) return fromCenter;
    }

    const count = vertices.length;
    const prev = index > 0 ? vertices[index - 1] : null;
    const next = index < count - 1 ? vertices[index + 1] : null;

    if (!prev && next) {
      return this._normalizeVector(this._localVector(next, current));
    }
    if (prev && !next) {
      return this._normalizeVector(this._localVector(prev, current));
    }
    if (prev && next) {
      const toPrev = this._normalizeVector(this._localVector(current, prev));
      const toNext = this._normalizeVector(this._localVector(current, next));
      const oppositeAngle = this._normalizeVector({
        x: toPrev.x + toNext.x,
        y: toPrev.y + toNext.y,
      });
      if (this._vectorLength(oppositeAngle) > 0) return oppositeAngle;

      const tangent = this._normalizeVector(this._localVector(prev, next));
      const normal = this._normalizeVector({ x: -tangent.y, y: tangent.x });
      if (this._vectorLength(normal) > 0) return normal;
    }

    return { x: 0, y: 1 };
  }

  private _localVector(from: Position, to: Position): { x: number; y: number } {
    const fromLng = from[0] ?? 0;
    const fromLat = from[1] ?? 0;
    const toLng = to[0] ?? 0;
    const toLat = to[1] ?? 0;
    const avgLatRad = ((fromLat + toLat) / 2) * (Math.PI / 180);
    return {
      x: (toLng - fromLng) * Math.cos(avgLatRad),
      y: toLat - fromLat,
    };
  }

  private _vectorLength(vector: { x: number; y: number }): number {
    return Math.hypot(vector.x, vector.y);
  }

  private _normalizeVector(vector: { x: number; y: number }): { x: number; y: number } {
    const length = this._vectorLength(vector);
    if (length === 0) return { x: 0, y: 0 };
    return {
      x: vector.x / length,
      y: vector.y / length,
    };
  }

  private _offsetCoordinateByDirection(
    base: Position,
    direction: { x: number; y: number },
    meters: number,
  ): Position {
    const baseLng = base[0];
    const baseLat = base[1];
    if (typeof baseLng !== 'number' || typeof baseLat !== 'number') return [0, 0];
    const normalized = this._normalizeVector(direction);
    if (this._vectorLength(normalized) === 0) return [baseLng, baseLat];
    const bearing = (Math.atan2(normalized.x, normalized.y) * 180) / Math.PI;
    const point = turf.destination(turf.point([baseLng, baseLat]), meters / 1000, bearing, {
      units: 'kilometers',
    });
    return point.geometry.coordinates;
  }

  private _pointInsidePolygon(point: Position, polygon: Feature<Polygon, GeoJsonProperties>) {
    return turf.booleanPointInPolygon(turf.point(point), polygon);
  }

  private _getMeasurementTargetFeature(): Feature<Geometry, GeoJsonProperties> | null {
    const drawFeature = this._getActiveDrawFeature();
    if (drawFeature) {
      return drawFeature;
    }

    if (this._hoveredFeatureId != null) {
      const hoveredFeature = this._getStoredFeatureById(this._hoveredFeatureId);
      if (hoveredFeature) return hoveredFeature;
    }

    return null;
  }

  private _getActiveDrawFeature(): Feature<Geometry, GeoJsonProperties> | null {
    if (!this._draw) return null;
    if (activeDrawMenuItem.value == null && this._controlsMode !== 'modify') return null;

    const features = this._draw.getAll().features;
    for (const feature of features) {
      if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
        return feature;
      }
    }
    return null;
  }

  private _extractVertices(feature: Feature<Geometry, GeoJsonProperties>): Position[] {
    if (feature.geometry.type === 'LineString') {
      return [...feature.geometry.coordinates];
    }
    if (feature.geometry.type === 'Polygon') {
      const ring = [...(feature.geometry.coordinates[0] ?? [])];
      if (ring.length > 1) {
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first && last && first[0] === last[0] && first[1] === last[1]) {
          ring.pop();
        }
      }
      return ring;
    }
    return [];
  }

  private _buildSegments(
    vertices: Position[],
    closeRing: boolean,
  ): Array<{ label: string; distance: number }> {
    const segments: Array<{ label: string; distance: number }> = [];
    const count = vertices.length;
    if (count < 2) return segments;

    for (let i = 0; i < count - 1; i += 1) {
      const start = vertices[i];
      const end = vertices[i + 1];
      if (!start || !end) continue;
      const segmentDistance = this._computeDistance(start, end);
      segments.push({ label: `${i}-${i + 1}`, distance: segmentDistance });
    }

    if (closeRing && count > 2) {
      const last = vertices[count - 1];
      const first = vertices[0];
      if (last && first) {
        const segmentDistance = this._computeDistance(last, first);
        segments.push({ label: `${count - 1}-0`, distance: segmentDistance });
      }
    }

    return segments;
  }

  private _computeDistance(start: Position, end: Position): number {
    const unit = this._getTurfDistanceUnit();
    return turf.distance(turf.point(start), turf.point(end), { units: unit });
  }

  private _computePolygonAreaSquareMeters(feature: Feature<Geometry, GeoJsonProperties>): number {
    if (feature.geometry.type !== 'Polygon') return 0;
    return turf.area(feature as Feature<Polygon, GeoJsonProperties>);
  }

  private _getDistanceUnitKey() {
    const settingsStore = useSettingsStore();
    return settingsStore.units;
  }

  private _getAdditionalSquareUnitKeys(): SquareUnitKey[] {
    const settingsStore = useSettingsStore();
    return settingsStore.square.filter((unit): unit is SquareUnitKey => unit in SquareUnits);
  }

  private _getTurfDistanceUnit(): turf.Units {
    const unitKey = this._getDistanceUnitKey();
    if (unitKey === 'kilometer') return 'kilometers';
    if (unitKey === 'mile') return 'miles';
    if (unitKey === 'meter') return 'meters';
    if (unitKey === 'foot') return 'feet';
    if (unitKey === 'yard') return 'yards';
    return 'nauticalmiles';
  }

  private _getDistanceUnitLabel(): string {
    const unitKey = this._getDistanceUnitKey();
    if (unitKey === 'kilometer') return 'km';
    if (unitKey === 'mile') return 'mi';
    if (unitKey === 'meter') return 'm';
    if (unitKey === 'foot') return 'ft';
    if (unitKey === 'yard') return 'yd';
    return 'nmi';
  }

  private _formatDistance(value: number): string {
    const unitLabel = this._getDistanceUnitLabel();
    const digits = value >= 100 ? 1 : 2;
    return `${value.toFixed(digits)} ${unitLabel}`;
  }

  private _formatAreaByUnit(valueSquareMeters: number, unitKey: SquareUnitKey): string {
    const unitLabel = this._getSquareUnitLabel(unitKey);
    const unitFactor = SquareUnits[unitKey] ?? SquareUnits.hectare;
    const value = valueSquareMeters / unitFactor;
    const digits = value >= 100 ? 1 : 2;
    return `${value.toFixed(digits)} ${unitLabel}`;
  }

  private _formatAreaByDistanceUnit(valueSquareMeters: number, unitKey: DistanceUnitKey): string {
    const linearFactor = DistanceUnits[unitKey] ?? DistanceUnits.nmile;
    const unitFactor = linearFactor * linearFactor;
    const value = valueSquareMeters / unitFactor;
    const unitLabel = this._getDistanceSquareUnitLabel(unitKey);
    const digits = value >= 100 ? 1 : 2;
    return `${value.toFixed(digits)} ${unitLabel}`;
  }

  private _getDistanceSquareUnitLabel(unitKey: DistanceUnitKey): string {
    if (unitKey === 'kilometer') return 'km²';
    if (unitKey === 'mile') return 'mi²';
    if (unitKey === 'meter') return 'm²';
    if (unitKey === 'foot') return 'ft²';
    if (unitKey === 'yard') return 'yd²';
    return 'nmi²';
  }

  private _getSquareUnitLabel(unitKey: SquareUnitKey): string {
    if (unitKey === 'decare') return 'daa';
    if (unitKey === 'are') return 'a';
    return 'ha';
  }

  private _applyHoverLayerFilters(featureId: DrawFeatureId | null) {
    if (!this._map) return;
    const hoverValue = featureId == null ? '__none__' : featureId;

    const polygonWhiteFilter: unknown[] = [
      'all',
      ['==', '$type', 'Polygon'],
      ['==', POI_HOVER_ID_PROPERTY, hoverValue],
    ];
    const polygonColorFilter: unknown[] = [
      'all',
      ['==', '$type', 'Polygon'],
      ['==', POI_HOVER_ID_PROPERTY, hoverValue],
    ];
    const lineWhiteFilter: unknown[] = [
      'all',
      ['==', '$type', 'LineString'],
      ['==', POI_HOVER_ID_PROPERTY, hoverValue],
    ];
    const lineColorFilter: unknown[] = [
      'all',
      ['==', '$type', 'LineString'],
      ['==', POI_HOVER_ID_PROPERTY, hoverValue],
    ];
    const pointWhiteFilter: unknown[] = [
      'all',
      ['==', '$type', 'Point'],
      ['==', POI_HOVER_ID_PROPERTY, hoverValue],
    ];
    const pointColorFilter: unknown[] = [
      'all',
      ['==', '$type', 'Point'],
      ['==', POI_HOVER_ID_PROPERTY, hoverValue],
    ];

    this._setLayerFilterSafe(POI_LAYER_POLYGON_HOVER_OUTLINE, polygonWhiteFilter);
    this._setLayerFilterSafe(POI_LAYER_POLYGON_HOVER_MAIN, polygonColorFilter);
    this._setLayerFilterSafe(POI_LAYER_LINE_HOVER_OUTLINE, lineWhiteFilter);
    this._setLayerFilterSafe(POI_LAYER_LINE_HOVER_MAIN, lineColorFilter);
    this._setLayerFilterSafe(POI_LAYER_POINT_HOVER_OUTLINE, pointWhiteFilter);
    this._setLayerFilterSafe(POI_LAYER_POINT_HOVER_MAIN, pointColorFilter);
  }

  private _setLayerFilterSafe(layerId: string, filter: unknown[]) {
    if (!this._map) return;
    if (this._map.getLayer(layerId)) {
      this._map.setFilter(layerId, filter as maplibregl.FilterSpecification);
    }
  }

  private _getStoredFeatureById(featureId: DrawFeatureId) {
    const poiStore = usePOIStore();
    return poiStore.drawings.find((item) => item.id === featureId);
  }

  private _normalizeFeatureIds(features: Array<Feature<Geometry, GeoJsonProperties>>) {
    const poiStore = usePOIStore();
    const existingIds = new Set<DrawFeatureId>();
    poiStore.drawings.forEach((item) => {
      if (item.id !== undefined) existingIds.add(item.id as DrawFeatureId);
    });

    return features.map((feature) => {
      if (feature.id === undefined || existingIds.has(feature.id as DrawFeatureId)) {
        feature.id = this._createFeatureId(existingIds);
      }
      existingIds.add(feature.id as DrawFeatureId);
      return feature;
    });
  }

  private _createFeatureId(existingIds: Set<DrawFeatureId>) {
    let nextId = Date.now();
    while (existingIds.has(nextId)) {
      nextId += 1;
    }
    return nextId;
  }

  private _refreshPOILayerData() {
    if (!this._map) return;
    const poiStore = usePOIStore();
    let source = this._map.getSource(POI_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source && this._isStyleReady()) {
      this._ensurePOILayers();
      source = this._map.getSource(POI_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    }
    if (!source) return;

    source.setData({
      type: 'FeatureCollection',
      features: poiStore.drawings.map((feature) => {
        const featureCopy = JSON.parse(JSON.stringify(feature)) as Feature<
          Geometry,
          GeoJsonProperties
        >;
        const sourceId = featureCopy.id;
        const properties = (featureCopy.properties ?? {}) as GeoJsonProperties;
        featureCopy.properties = {
          ...properties,
          [POI_HOVER_ID_PROPERTY]: sourceId,
        };
        return featureCopy;
      }),
    });
    this._setHoveredFeatureId(this._hoveredFeatureId);
  }

  private _ensurePOILayers() {
    if (!this._map) return;
    if (!this._isStyleReady()) return;
    try {
      const poiStore = usePOIStore();
      const polygonColor = poiStore.style.polygonColor;
      const polygonFillColor = poiStore.style.polygonFillColor;
      const polygonFillOpacity = poiStore.style.polygonFillOpacity;
      const polygonBorderWidth = poiStore.style.polygonBorderWidth;

      if (!this._map.getSource(POI_SOURCE_ID)) {
        this._map.addSource(POI_SOURCE_ID, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      if (!this._map.getSource(MEASURE_VERTEX_SOURCE_ID)) {
        this._map.addSource(MEASURE_VERTEX_SOURCE_ID, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      if (!this._map.getLayer(POI_LAYER_POLYGON_FILL)) {
        this._map.addLayer({
          id: POI_LAYER_POLYGON_FILL,
          type: 'fill',
          source: POI_SOURCE_ID,
          filter: ['==', '$type', 'Polygon'],
          paint: {
            'fill-color': polygonFillColor,
            'fill-outline-color': polygonColor,
            'fill-opacity': polygonFillOpacity,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_POLYGON_HOVER_OUTLINE)) {
        this._map.addLayer({
          id: POI_LAYER_POLYGON_HOVER_OUTLINE,
          type: 'line',
          source: POI_SOURCE_ID,
          filter: ['all', ['==', '$type', 'Polygon'], ['==', POI_HOVER_ID_PROPERTY, '__none__']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#ffffff',
            'line-width': polygonBorderWidth + 4,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_POLYGON_HOVER_MAIN)) {
        this._map.addLayer({
          id: POI_LAYER_POLYGON_HOVER_MAIN,
          type: 'line',
          source: POI_SOURCE_ID,
          filter: ['all', ['==', '$type', 'Polygon'], ['==', POI_HOVER_ID_PROPERTY, '__none__']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': polygonColor,
            'line-width': polygonBorderWidth + 2,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_POLYGON_LINE)) {
        this._map.addLayer({
          id: POI_LAYER_POLYGON_LINE,
          type: 'line',
          source: POI_SOURCE_ID,
          filter: ['==', '$type', 'Polygon'],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': polygonColor,
            'line-width': polygonBorderWidth,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_LINE_HOVER_OUTLINE)) {
        this._map.addLayer({
          id: POI_LAYER_LINE_HOVER_OUTLINE,
          type: 'line',
          source: POI_SOURCE_ID,
          filter: ['all', ['==', '$type', 'LineString'], ['==', POI_HOVER_ID_PROPERTY, '__none__']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#ffffff',
            'line-width': polygonBorderWidth + 4,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_LINE_HOVER_MAIN)) {
        this._map.addLayer({
          id: POI_LAYER_LINE_HOVER_MAIN,
          type: 'line',
          source: POI_SOURCE_ID,
          filter: ['all', ['==', '$type', 'LineString'], ['==', POI_HOVER_ID_PROPERTY, '__none__']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': polygonColor,
            'line-width': polygonBorderWidth + 2,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_LINE)) {
        this._map.addLayer({
          id: POI_LAYER_LINE,
          type: 'line',
          source: POI_SOURCE_ID,
          filter: ['==', '$type', 'LineString'],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': polygonColor,
            'line-width': polygonBorderWidth,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_POINT_HOVER_OUTLINE)) {
        this._map.addLayer({
          id: POI_LAYER_POINT_HOVER_OUTLINE,
          type: 'circle',
          source: POI_SOURCE_ID,
          filter: ['all', ['==', '$type', 'Point'], ['==', POI_HOVER_ID_PROPERTY, '__none__']],
          paint: {
            'circle-radius': 9,
            'circle-color': '#ffffff',
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_POINT_HOVER_MAIN)) {
        this._map.addLayer({
          id: POI_LAYER_POINT_HOVER_MAIN,
          type: 'circle',
          source: POI_SOURCE_ID,
          filter: ['all', ['==', '$type', 'Point'], ['==', POI_HOVER_ID_PROPERTY, '__none__']],
          paint: {
            'circle-radius': 7,
            'circle-color': polygonColor,
          },
        });
      }
      if (!this._map.getLayer(POI_LAYER_POINT)) {
        this._map.addLayer({
          id: POI_LAYER_POINT,
          type: 'circle',
          source: POI_SOURCE_ID,
          filter: ['==', '$type', 'Point'],
          paint: {
            'circle-radius': 5,
            'circle-color': polygonColor,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        });
      }

      if (!this._map.getLayer(MEASURE_VERTEX_CIRCLE_LAYER_ID)) {
        this._map.addLayer({
          id: MEASURE_VERTEX_CIRCLE_LAYER_ID,
          type: 'circle',
          source: MEASURE_VERTEX_SOURCE_ID,
          paint: {
            'circle-radius': 9,
            'circle-color': '#000000',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.8,
          },
        });
      }

      if (!this._map.getLayer(MEASURE_VERTEX_LABEL_LAYER_ID)) {
        this._map.addLayer({
          id: MEASURE_VERTEX_LABEL_LAYER_ID,
          type: 'symbol',
          source: MEASURE_VERTEX_SOURCE_ID,
          layout: {
            'text-field': ['get', 'index'],
            'text-size': 12,
            'text-offset': [0, 0],
            'text-anchor': 'center',
            'text-allow-overlap': true,
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1.2,
          },
        });
      }
    } catch {
      return;
    }
  }

  private _syncPOILayersAndData() {
    if (!this._map) return;
    if (!this._isStyleReady()) return;
    this._ensurePOILayers();
    this._refreshPOILayerData();
  }

  private _isStyleReady() {
    if (!this._map) return false;
    const maybeMap = this._map as unknown as {
      isStyleLoaded?: () => boolean;
    };
    if (typeof maybeMap.isStyleLoaded === 'function') {
      return maybeMap.isStyleLoaded();
    }
    return true;
  }

  private _scheduleStartupSync() {
    const delays = [0, 120, 400, 1000, 2000];
    delays.forEach((delay) => {
      setTimeout(() => {
        this._syncPOILayersAndData();
      }, delay);
    });
  }

  private _protectControlButton(button: HTMLButtonElement) {
    const stopMapEvent = (event: Event) => {
      event.stopPropagation();
      if ('stopImmediatePropagation' in event) {
        event.stopImmediatePropagation();
      }
    };

    const stopContextMenu = (event: Event) => {
      event.preventDefault();
      stopMapEvent(event);
    };

    button.addEventListener('pointerdown', stopMapEvent, { capture: true });
    button.addEventListener('pointerup', stopMapEvent, { capture: true });
    button.addEventListener('mousedown', stopMapEvent, { capture: true });
    button.addEventListener('mouseup', stopMapEvent, { capture: true });
    button.addEventListener('dblclick', stopMapEvent, { capture: true });
    button.addEventListener('touchstart', stopMapEvent, { capture: true });
    button.addEventListener('touchend', stopMapEvent, { capture: true });
    button.addEventListener('contextmenu', stopContextMenu, { capture: true });
  }

  private _buildDrawStyles(poiStore: ReturnType<typeof usePOIStore>) {
    const activeColor = poiStore.style.drawActiveColor;
    const polygonColor = poiStore.style.polygonColor;
    const polygonFillColor = poiStore.style.polygonFillColor;
    const polygonFillOpacity = poiStore.style.polygonFillOpacity;
    const polygonBorderWidth = poiStore.style.polygonBorderWidth;

    return [
      {
        id: 'gl-draw-polygon-fill-inactive',
        type: 'fill',
        filter: [
          'all',
          ['==', 'active', 'false'],
          ['==', '$type', 'Polygon'],
          ['!=', 'mode', 'static'],
        ],
        paint: {
          'fill-color': polygonFillColor,
          'fill-outline-color': polygonColor,
          'fill-opacity': polygonFillOpacity,
        },
      },
      {
        id: 'gl-draw-polygon-fill-active',
        type: 'fill',
        filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        paint: {
          'fill-color': activeColor,
          'fill-outline-color': activeColor,
          'fill-opacity': polygonFillOpacity,
        },
      },
      {
        id: 'gl-draw-polygon-midpoint',
        type: 'circle',
        filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
        paint: {
          'circle-radius': 6,
          'circle-color': activeColor,
        },
      },
      {
        id: 'gl-draw-polygon-stroke-inactive',
        type: 'line',
        filter: [
          'all',
          ['==', 'active', 'false'],
          ['==', '$type', 'Polygon'],
          ['!=', 'mode', 'static'],
        ],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': polygonColor,
          'line-width': polygonBorderWidth,
        },
      },
      {
        id: 'gl-draw-polygon-stroke-active',
        type: 'line',
        filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': activeColor,
          'line-dasharray': [0.2, 2],
          'line-width': polygonBorderWidth + 2,
        },
      },
      {
        id: 'gl-draw-line-inactive',
        type: 'line',
        filter: [
          'all',
          ['==', 'active', 'false'],
          ['==', '$type', 'LineString'],
          ['!=', 'mode', 'static'],
        ],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': polygonColor,
          'line-width': polygonBorderWidth,
        },
      },
      {
        id: 'gl-draw-line-active',
        type: 'line',
        filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': activeColor,
          'line-dasharray': [0.2, 2],
          'line-width': polygonBorderWidth + 2,
        },
      },
      {
        id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
        type: 'circle',
        filter: [
          'all',
          ['==', 'meta', 'vertex'],
          ['==', '$type', 'Point'],
          ['!=', 'mode', 'static'],
        ],
        paint: {
          'circle-radius': 7,
          'circle-color': '#fff',
        },
      },
      {
        id: 'gl-draw-polygon-and-line-vertex-inactive',
        type: 'circle',
        filter: [
          'all',
          ['==', 'meta', 'vertex'],
          ['==', '$type', 'Point'],
          ['!=', 'mode', 'static'],
        ],
        paint: {
          'circle-radius': 5,
          'circle-color': activeColor,
        },
      },
      {
        id: 'gl-draw-point-point-stroke-inactive',
        type: 'circle',
        filter: [
          'all',
          ['==', 'active', 'false'],
          ['==', '$type', 'Point'],
          ['==', 'meta', 'feature'],
          ['!=', 'mode', 'static'],
        ],
        paint: {
          'circle-radius': 5,
          'circle-opacity': 1,
          'circle-color': '#fff',
        },
      },
      {
        id: 'gl-draw-point-inactive',
        type: 'circle',
        filter: [
          'all',
          ['==', 'active', 'false'],
          ['==', '$type', 'Point'],
          ['==', 'meta', 'feature'],
          ['!=', 'mode', 'static'],
        ],
        paint: {
          'circle-radius': 3,
          'circle-color': polygonColor,
        },
      },
      {
        id: 'gl-draw-point-stroke-active',
        type: 'circle',
        filter: [
          'all',
          ['==', '$type', 'Point'],
          ['==', 'active', 'true'],
          ['!=', 'meta', 'midpoint'],
        ],
        paint: {
          'circle-radius': 7,
          'circle-color': '#fff',
        },
      },
      {
        id: 'gl-draw-point-active',
        type: 'circle',
        filter: [
          'all',
          ['==', '$type', 'Point'],
          ['!=', 'meta', 'midpoint'],
          ['==', 'active', 'true'],
        ],
        paint: {
          'circle-radius': 5,
          'circle-color': activeColor,
        },
      },
      {
        id: 'gl-draw-polygon-fill-static',
        type: 'fill',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
        paint: {
          'fill-color': '#404040',
          'fill-outline-color': '#404040',
          'fill-opacity': polygonFillOpacity,
        },
      },
      {
        id: 'gl-draw-polygon-stroke-static',
        type: 'line',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#404040',
          'line-width': polygonBorderWidth,
        },
      },
      {
        id: 'gl-draw-line-static',
        type: 'line',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#404040',
          'line-width': polygonBorderWidth,
        },
      },
      {
        id: 'gl-draw-point-static',
        type: 'circle',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
        paint: {
          'circle-radius': 5,
          'circle-color': '#404040',
        },
      },
    ];
  }

  private _resetDrawingState() {
    activeDrawMenuItem.value = null;
    this._controlsMode = 'hidden';
    this._clearTileSquarePreview();
    if (this._map) {
      this._map.getCanvas().style.cursor = '';
    }
    if (this._container) {
      this._container.style.display = 'none';
      this._container.style.visibility = 'hidden';
      this._container.style.opacity = '0';
    }
  }
}

export const drawer = new Drawer();

export default Drawer;
