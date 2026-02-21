/**
 * MapLibre GL JS is loaded from CDN (vendor/maplibre-gl.js)
 * This declares the global maplibregl namespace for TypeScript
 */

import type { GeoJSON } from 'geojson';

declare global {
  namespace maplibregl {
    // Event types
    interface MapGeoJSONFeature {
      type: 'Feature';
      geometry: GeoJSON.Geometry;
      properties: Record<string, unknown>;
      id?: string | number;
      source?: string;
      sourceLayer?: string;
      layer?: LayerSpecification;
      state?: Record<string, unknown>;
    }

    interface MapMouseEvent extends MouseEvent {
      type: string;
      target: Map;
      originalEvent: MouseEvent;
      point: Point;
      lngLat: LngLat;
      preventDefault(): void;
      defaultPrevented: boolean;
      features?: GeoJSON.Feature[];
    }

    interface MapTouchEvent extends TouchEvent {
      lngLat?: LngLat;
      point?: Point;
      lngLats?: LngLat[];
      points?: Point[];
    }

    interface MapWheelEvent extends WheelEvent {
      lngLat?: LngLat;
      point?: Point;
    }

    interface MapBoxZoomEvent {
      originalEvent: MouseEvent;
      boxZoomBounds?: LngLatBounds;
    }

    interface GetResourceResponse<T> {
      data: T;
      cors?: 'same-origin' | 'cross-origin';
    }

    // Core Map class
    class Map {
      constructor(options: MapOptions);
      getContainer(): HTMLElement;
      getCanvas(): HTMLCanvasElement;
      getCanvasContainer(): HTMLElement;
      getStyle(): StyleSpecification;

      setStyle(
        style: StyleSpecification | string,
        options?: { diff?: boolean; validate?: boolean },
      ): Map;
      addSource(id: string, source: SourceSpecification): Map;
      isSourceLoaded(id: string): boolean;
      removeSource(id: string): Map;
      getSource(id: string): AnySourceData;
      addLayer(layer: LayerSpecification, beforeId?: string): Map;
      moveLayer(id: string, beforeId?: string): Map;
      removeLayer(id: string): Map;

      getLayer(id: string): LayerSpecification | undefined;

      setFilter(layer: string, filter: FilterSpecification | null, options?: object): Map;

      getFilter(layer: string): FilterSpecification | undefined;
      setLayerZoomRange(layer: string, minzoom: number, maxzoom: number): Map;

      setPaintProperty(layer: string, name: string, value: unknown, options?: object): Map;
      getPaintProperty(layer: string, name: string): unknown;

      setLayoutProperty(layer: string, name: string, value: unknown, options?: object): Map;
      getLayoutProperty(layer: string, name: string): unknown;
      getFeatureState(target: {
        source: string;
        sourceLayer?: string;
        id?: string | number;
      }): object;
      setFeatureState(
        target: { source: string; sourceLayer?: string; id?: string | number },
        state: object,
      ): Map;
      removeFeatureState(
        target: { source: string; sourceLayer?: string; id?: string | number },
        key?: string,
      ): Map;
      setZoom(zoom: number): Map;
      getZoom(): number;
      zoomTo(zoom: number, options?: AnimationOptions): Map;
      zoomIn(options?: unknown): Map;
      zoomOut(options?: unknown): Map;
      getCenter(): LngLat;
      setCenter(center: LngLatLike, options?: AnimationOptions): Map;
      panTo(lnglat: LngLatLike, options?: AnimationOptions): Map;
      panBy(offset: [number, number], options?: AnimationOptions): Map;
      getBounds(): LngLatBounds;
      getMaxBounds(): LngLatBounds | null;
      setMaxBounds(bounds: LngLatBoundsLike | null): Map;
      setMinZoom(minZoom: number): Map;
      getMinZoom(): number;
      setMaxZoom(maxZoom: number): Map;
      getMaxZoom(): number;
      setBearing(bearing: number, options?: AnimationOptions): Map;
      getBearing(): number;
      loadImage(
        url: string,
        callback: (error: Error | null, image?: HTMLImageElement | ImageData) => void,
      ): void;
      loadImage(url: string): Promise<GetResourceResponse<HTMLImageElement | ImageData>>;
      getPitch(): number;
      setPitch(pitch: number, options?: AnimationOptions): Map;
      cameraForBounds(
        bounds: LngLatBoundsLike,
        options?: CameraForBoundsOptions,
      ): CameraOptions | undefined;
      fitBounds(bounds: LngLatBoundsLike, options?: FitBoundsOptions): Map;
      jumpTo(options: CameraOptions): Map;
      easeTo(options: EaseToOptions, eventData?: object): Map;
      flyTo(options: FlyToOptions, eventData?: object): Map;
      isMoving(): boolean;
      isZooming(): boolean;
      isRotating(): boolean;
      // Event handler overloads - multi-argument version for layer-specific events
      on(
        type: 'mouseenter' | 'mouseleave' | 'click' | 'dblclick' | 'mousedown' | 'mouseup',
        layers: string | string[],
        listener: (e: MapMouseEvent) => void,
      ): Map;
      on(
        type: 'touchstart' | 'touchend' | 'touchcancel',
        layers: string | string[],
        listener: (e: MapTouchEvent) => void,
      ): Map;
      // Standard event handlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on(type: string, listener: (e?: any) => void): Map;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      off(type: string, listener?: (e?: any) => void): Map;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      once(type: string, listener: (e?: any) => void): Map;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fire(type: string, data?: any): Map;
      listens(type: string): boolean;
      getMaxTileCacheSize(): number;
      setMaxTileCacheSize(size: number): Map;
      project(lnglat: LngLatLike): Point;
      unproject(point: PointLike): LngLat;
      querySourceFeatures(sourceId: string, parameters?: SourceQueryOptions): MapGeoJSONFeature[];
      queryRenderedFeatures(
        geometry?: PointLike | PointLike[],
        options?: {
          layers?: string[];
          filter?: unknown[];
          validate?: boolean;
        },
      ): MapGeoJSONFeature[];
      getLoaded(): boolean;
      areTilesLoaded(): boolean;

      setFog(fog: FogSpecification | null): Map;

      getFog(): FogSpecification | null;
      addImage(
        name: string,
        image:
          | HTMLImageElement
          | ImageData
          | { width: number; height: number; data: Uint8Array | Uint8ClampedArray },
        options?: { pixelRatio: number; sdf?: boolean },
      ): Map;
      updateImage(
        name: string,
        image:
          | HTMLImageElement
          | ImageData
          | { width: number; height: number; data: Uint8Array | Uint8ClampedArray },
      ): Map;
      removeImage(name: string): Map;
      hasImage(name: string): boolean;
      getImage(name: string): HTMLImageElement | ImageData | null;
      listImages(): string[];
      addControl(control: IControl, position?: ControlPosition): Map;
      removeControl(control: IControl): Map;
      remove(): void;
      triggerRepaint(): void;
      getStyle(): StyleSpecification;
      resize(): Map;
      showTileBoundaries: boolean;
      showPadding: boolean;
      showCollisionBoxes: boolean;
    }

    // LngLat class
    class LngLat {
      constructor(lng: number, lat: number);
      lng: number;
      lat: number;
      wrap(): LngLat;
      toArray(): [number, number];
      toString(): string;
      distanceTo(other: LngLat): number;
      static convert(input: LngLatLike): LngLat;
    }

    // LngLatBounds class
    class LngLatBounds {
      constructor(sw?: LngLatLike | [number, number, number, number], ne?: LngLatLike);
      setNorthEast(ne: LngLatLike): LngLatBounds;
      setSouthWest(sw: LngLatLike): LngLatBounds;
      getNorthEast(): LngLat;
      getSouthWest(): LngLat;
      getNorthWest(): LngLat;
      getSouthEast(): LngLat;
      getWest(): number;
      getSouth(): number;
      getEast(): number;
      getNorth(): number;
      toArray(): [[number, number], [number, number]];
      toString(): string;
      contains(lnglat: LngLatLike): boolean;
      intersects(other: LngLatBounds): boolean;
      extend(obj: LngLat | LngLatBounds): LngLatBounds;
      static convert(input: LngLatBoundsLike): LngLatBounds;
    }

    // Marker class
    class Marker {
      constructor(options?: MarkerOptions);
      addTo(map: Map): Marker;
      remove(): Marker;
      getLngLat(): LngLat;
      setLngLat(lnglat: LngLatLike): Marker;
      getElement(): HTMLElement;
      setPopup(popup?: Popup): Marker;
      getPopup(): Popup | undefined;
      togglePopup(): Marker;
      setOffset(offset: PointLike): Marker;
      getOffset(): Point;
      setDraggable(shouldBeDraggable: boolean): Marker;
      isDraggable(): boolean;
      setRotation(angle: number): Marker;
      getRotation(): number;
      getRotationAlignment(): string;
      setRotationAlignment(alignment: string): Marker;
      getPitchAlignment(): string;
      setPitchAlignment(alignment: string): Marker;
    }

    // Popup class
    class Popup {
      constructor(options?: PopupOptions);
      addTo(map: Map): Popup;
      remove(): Popup;
      getLngLat(): LngLat;
      setLngLat(lnglat: LngLatLike): Popup;
      setText(text: string): Popup;
      setHTML(html: string): Popup;
      getElement(): HTMLElement;
      addClassName(className: string): Popup;
      removeClassName(className: string): Popup;
      toggleClassName(className: string): Popup;
      isOpen(): boolean;
    }

    // Geolocate Control
    class GeolocateControl implements IControl {
      constructor(options?: GeolocateControlOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
      trigger(): boolean;
    }

    // Navigation Control
    class NavigationControl implements IControl {
      constructor(options?: NavigationControlOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
    }

    // Scale Control
    class ScaleControl implements IControl {
      constructor(options?: ScaleControlOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
      setUnit(unit: 'imperial' | 'metric'): void;
    }

    // Attribution Control
    class AttributionControl implements IControl {
      constructor(options?: AttributionControlOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
      setCustomAttribution(attribution: string): void;
    }

    // Fullscreen Control
    class FullscreenControl implements IControl {
      constructor(options?: { container?: HTMLElement });
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
    }

    // Globe Control
    class GlobeControl implements IControl {
      constructor(options?: GlobeControlOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
    }

    // Control interface
    interface IControl {
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
    }

    // Source classes (runtime instances)
    interface SourceBase {
      type: string;
    }

    class GeoJSONSource implements SourceBase {
      type: 'geojson';
      setData(data: GeoJSON.GeoJSON | string): GeoJSONSource;
      getData(): GeoJSON.GeoJSON;
      updateData(data: GeoJSON.GeoJSON): GeoJSONSource;
      getClusterExpansionZoom(clusterId: number): Promise<number>;
      getClusterChildren(clusterId: number): Promise<MapGeoJSONFeature[]>;
      getClusterLeaves(
        clusterId: number,
        limit?: number,
        offset?: number,
      ): Promise<MapGeoJSONFeature[]>;
    }

    class VectorSource implements SourceBase {
      type: 'vector';
    }

    class RasterSource implements SourceBase {
      type: 'raster';
    }

    class RasterDemSource implements SourceBase {
      type: 'raster-dem';
    }

    class ImageSource implements SourceBase {
      type: 'image';
      updateImage(options: {
        url?: string;
        coordinates?: [[number, number], [number, number], [number, number], [number, number]];
      }): ImageSource;
    }

    class VideoSource implements SourceBase {
      type: 'video';
      play(): VideoSource;
      pause(): VideoSource;
    }

    // Type definitions
    type LngLatLike =
      | LngLat
      | [number, number]
      | { lng: number; lat: number }
      | { lon: number; lat: number };
    type LngLatBoundsLike =
      | LngLatBounds
      | [[number, number], [number, number]]
      | [number, number, number, number];
    type PointLike = Point | [number, number];
    type ControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    type StyleImageInterface = {
      width: number;
      height: number;
      data: Uint8Array;
      onAdd?: (map: Map) => void;
      render?: () => boolean;
    };

    // Options interfaces
    interface MapOptions {
      container: string | HTMLElement;

      style: StyleSpecification | string;
      center?: LngLatLike;
      zoom?: number;
      bearing?: number;
      pitch?: number;
      minZoom?: number;
      maxZoom?: number;
      minPitch?: number;
      maxPitch?: number;
      maxBounds?: LngLatBoundsLike;
      interactive?: boolean;
      scrollZoom?: boolean | { around?: ControlPosition };
      boxZoom?: boolean;
      dragRotate?: boolean;
      dragPan?: boolean;
      keyboard?: boolean;
      doubleClickZoom?: boolean;
      touchZoomRotate?: boolean;
      touchPitch?: boolean;
      keyboard?: boolean;
      attributionControl?: boolean;
      customAttribution?: string | string[];
      logoPosition?: ControlPosition;
      failIfMajorPerformanceCaveat?: boolean;
      preserveDrawingBuffer?: boolean;
      antialias?: boolean;
      refreshExpiredTiles?: boolean;
      maxTileCacheSize?: number;
      locale?: unknown;
      worldCopyJump?: boolean;
      crossSourceCollisions?: boolean;
      collectResourceTiming?: boolean;
      optimizeForTerrain?: boolean;
      pixelRatio?: number;
      transformRequest?: (
        url: string,
        resourceType: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => { url: string; headers?: any; credentials?: RequestCredentials } | void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }

    interface AnimationOptions {
      duration?: number;
      easing?: (t: number) => number;
      offset?: PointLike;
      animate?: boolean;
    }

    interface CameraOptions {
      center?: LngLatLike;
      zoom?: number;
      bearing?: number;
      pitch?: number;
      padding?: number | PaddingOptions;
    }

    interface FitBoundsOptions extends AnimationOptions {
      padding?: number | PaddingOptions;
      maxZoom?: number;
      linear?: boolean;
    }

    interface CameraForBoundsOptions {
      padding?: number | PaddingOptions;
      offset?: PointLike;
      maxZoom?: number;
    }

    interface EaseToOptions extends CameraOptions, AnimationOptions {}

    interface FlyToOptions extends CameraOptions, AnimationOptions {
      curve?: number;
      minZoom?: number;
      speed?: number;
      screenSpeed?: number;
      maxDuration?: number;
      essential?: boolean;
    }

    interface PaddingOptions {
      top: number;
      bottom: number;
      left: number;
      right: number;
    }

    interface MarkerOptions {
      element?: HTMLElement;
      offset?: PointLike;
      anchor?:
        | 'center'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right';
      color?: string;
      scale?: number;
      draggable?: boolean;
      rotation?: number;
      rotationAlignment?: string;
      pitchAlignment?: string;
      popup?: Popup;
    }

    interface PopupOptions {
      closeButton?: boolean;
      closeOnClick?: boolean;
      focusAfterOpen?: boolean;
      anchor?: string;
      offset?:
        | PointLike
        | {
            top: PointLike;
            bottom: PointLike;
            left: PointLike;
            right: PointLike;
            'top-left': PointLike;
            'top-right': PointLike;
            'bottom-left': PointLike;
            'bottom-right': PointLike;
          };
      className?: string;
      maxWidth?: string;
    }

    interface GeolocateControlOptions {
      positionOptions?: PositionOptions;
      fitBoundsOptions?: FitBoundsOptions;
      trackUserLocation?: boolean;
      showAccuracyCircle?: boolean;
      showUserLocation?: boolean;
      showAccuracy?: boolean;
      geolocation?: Geolocation;
    }

    interface NavigationControlOptions {
      showCompass?: boolean;
      showZoom?: boolean;
      visualizePitch?: boolean;
    }

    interface ScaleControlOptions {
      maxWidth?: number;
      unit?: 'imperial' | 'metric';
    }

    interface AttributionControlOptions {
      compact?: boolean;
      customAttribution?: string | string[];
    }

    interface GlobeControlOptions {
      globeStyle?: 'light' | 'dark' | 'simple';
    }

    // Layer and Source types from your code
    // These follow the MapLibre Style Specification (simplified)
    interface LayerSpecificationBase {
      id: string;
      type:
        | 'background'
        | 'fill'
        | 'line'
        | 'symbol'
        | 'raster'
        | 'circle'
        | 'fill-extrusion'
        | 'heatmap'
        | 'hillshade';
      source?: string;
      'source-layer'?: string;
      minzoom?: number;
      maxzoom?: number;
      filter?: FilterSpecification;
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }

    interface LineLayerSpecification extends LayerSpecificationBase {
      type: 'line';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface FillLayerSpecification extends LayerSpecificationBase {
      type: 'fill';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface SymbolLayerSpecification extends LayerSpecificationBase {
      type: 'symbol';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface BackgroundLayerSpecification extends LayerSpecificationBase {
      type: 'background';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface RasterLayerSpecification extends LayerSpecificationBase {
      type: 'raster';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface CircleLayerSpecification extends LayerSpecificationBase {
      type: 'circle';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface FillExtrusionLayerSpecification extends LayerSpecificationBase {
      type: 'fill-extrusion';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface HeatmapLayerSpecification extends LayerSpecificationBase {
      type: 'heatmap';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    interface HillshadeLayerSpecification extends LayerSpecificationBase {
      type: 'hillshade';
      layout?: Record<string, unknown>;
      paint?: Record<string, unknown>;
    }

    type LayerSpecification =
      | BackgroundLayerSpecification
      | FillLayerSpecification
      | LineLayerSpecification
      | SymbolLayerSpecification
      | RasterLayerSpecification
      | CircleLayerSpecification
      | FillExtrusionLayerSpecification
      | HeatmapLayerSpecification
      | HillshadeLayerSpecification;
    interface VectorSourceSpecification {
      type: 'vector';
      url?: string;
      tiles?: string[];
      bounds?: [number, number, number, number];
      scheme?: 'xyz' | 'tms';
      minzoom?: number;
      maxzoom?: number;
      format?: 'pbf';
      pixel_scale?: string | number;
      tileSize?: number;
      attribution?: string;
      promoteId?: string | Record<string, string>;
      volatile?: boolean;
    }

    interface RasterSourceSpecification {
      type: 'raster';
      url?: string;
      tiles?: string[];
      bounds?: [number, number, number, number];
      scheme?: 'xyz' | 'tms';
      minzoom?: number;
      maxzoom?: number;
      tileSize?: number;
      attribution?: string;
      volatile?: boolean;
    }

    interface RasterDemSourceSpecification {
      type: 'raster-dem';
      url?: string;
      tiles?: string[];
      bounds?: [number, number, number, number];
      scheme?: 'xyz' | 'tms';
      minzoom?: number;
      maxzoom?: number;
      tileSize?: number;
      attribution?: string;
      encoding?: 'terrarium' | 'mapbox';
      volatile?: boolean;
    }

    interface GeoJSONSourceSpecification {
      type: 'geojson';
      data: GeoJSON.GeoJSON | string;
      maxzoom?: number;
      attribution?: string;
      buffer?: number;
      tolerance?: number;
      cluster?: boolean;
      clusterRadius?: number;
      clusterMaxZoom?: number;
      clusterProperties?: Record<string, unknown>;
      lineMetrics?: boolean;
      generateId?: boolean;
      promoteId?: string | Record<string, string>;
    }

    interface ImageSourceSpecification {
      type: 'image';
      url: string;
      coordinates: [[number, number], [number, number], [number, number], [number, number]];
    }

    interface VideoSourceSpecification {
      type: 'video';
      urls: string[];
      coordinates: [[number, number], [number, number], [number, number], [number, number]];
    }

    type SourceSpecification =
      | VectorSourceSpecification
      | RasterSourceSpecification
      | RasterDemSourceSpecification
      | GeoJSONSourceSpecification
      | ImageSourceSpecification
      | VideoSourceSpecification;
    interface StyleSpecification {
      version: 8;
      name?: string;
      metadata?: Record<string, unknown>;
      center?: [number, number];
      zoom?: number;
      bearing?: number;
      pitch?: number;
      light?: Record<string, unknown>;
      terrain?: Record<string, unknown>;
      fog?: FogSpecification;
      sources: Record<string, SourceSpecification>;
      sprite?: string;
      glyphs?: string;
      layers: LayerSpecification[];
      sky?: Record<string, unknown>;
      transition?: Record<string, unknown>;
    }
    type FilterSpecification = unknown[];

    interface FogSpecification {
      range?: [number, number];
      color?: string;
      'high-color'?: string;
      'space-color'?: string;
      'horizon-blend'?: number;
      'star-intensity'?: number;
    }

    type AnySourceData =
      | GeoJSONSource
      | VectorSource
      | RasterSource
      | RasterDemSource
      | ImageSource
      | VideoSource;

    interface SourceQueryOptions {
      sourceLayer?: string;
      filter?: FilterSpecification;
      validate?: boolean;
    }

    // Point class
    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      matMult(m: number[][]): Point;
      unit(): Point;
      scale(k: number): Point;
      rotate(a: number): Point;
      mag(): number;
      equals(other: Point): boolean;
      dist(other: Point): number;
      distSq(other: Point): number;
      perp(): Point;
      round(): Point;
      add(other: Point): Point;
      sub(other: Point): Point;
      multByMatrix(m: number[][]): Point;
      clone(): Point;
      toArray(): [number, number];
    }
  }

  const maplibregl: typeof maplibregl;
}

export {};
