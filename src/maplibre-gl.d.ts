/**
 * Type declarations shim for maplibre-gl loaded from CDN
 * This re-exports types from the global maplibregl namespace for compatibility
 * with code that uses `import type { ... } from 'maplibre-gl'`
 */

declare module 'maplibre-gl' {
  export type Map = maplibregl.Map;
  export type LngLat = maplibregl.LngLat;
  export type LngLatBounds = maplibregl.LngLatBounds;
  export type Marker = maplibregl.Marker;
  export type Popup = maplibregl.Popup;
  export type GeolocateControl = maplibregl.GeolocateControl;
  export type NavigationControl = maplibregl.NavigationControl;
  export type ScaleControl = maplibregl.ScaleControl;
  export type AttributionControl = maplibregl.AttributionControl;
  export type FullscreenControl = maplibregl.FullscreenControl;
  export type IControl = maplibregl.IControl;
  export type Point = maplibregl.Point;
  export type MapGeoJSONFeature = maplibregl.MapGeoJSONFeature;
  export type MapMouseEvent = maplibregl.MapMouseEvent;
  export type MapTouchEvent = maplibregl.MapTouchEvent;
  export type MapWheelEvent = maplibregl.MapWheelEvent;
  export type MapBoxZoomEvent = maplibregl.MapBoxZoomEvent;
  export type GetResourceResponse<T> = maplibregl.GetResourceResponse<T>;

  // Type aliases
  export type LngLatLike = maplibregl.LngLatLike;
  export type LngLatBoundsLike = maplibregl.LngLatBoundsLike;
  export type PointLike = maplibregl.PointLike;
  export type ControlPosition = maplibregl.ControlPosition;
  export type StyleImageInterface = maplibregl.StyleImageInterface;

  // Options interfaces
  export type MapOptions = maplibregl.MapOptions;
  export type AnimationOptions = maplibregl.AnimationOptions;
  export type CameraOptions = maplibregl.CameraOptions;
  export type FitBoundsOptions = maplibregl.FitBoundsOptions;
  export type CameraForBoundsOptions = maplibregl.CameraForBoundsOptions;
  export type EaseToOptions = maplibregl.EaseToOptions;
  export type FlyToOptions = maplibregl.FlyToOptions;
  export type PaddingOptions = maplibregl.PaddingOptions;
  export type MarkerOptions = maplibregl.MarkerOptions;
  export type PopupOptions = maplibregl.PopupOptions;
  export type GeolocateControlOptions = maplibregl.GeolocateControlOptions;
  export type NavigationControlOptions = maplibregl.NavigationControlOptions;
  export type ScaleControlOptions = maplibregl.ScaleControlOptions;
  export type AttributionControlOptions = maplibregl.AttributionControlOptions;
  export type FlyToOptions = maplibregl.FlyToOptions;

  // Layer and Source types
  export type LayerSpecification = maplibregl.LayerSpecification;
  export type LineLayerSpecification = maplibregl.LineLayerSpecification;
  export type FillLayerSpecification = maplibregl.FillLayerSpecification;
  export type SymbolLayerSpecification = maplibregl.SymbolLayerSpecification;
  export type SourceSpecification = maplibregl.SourceSpecification;
  export type StyleSpecification = maplibregl.StyleSpecification;
  export type FilterSpecification = maplibregl.FilterSpecification;
  export type FogSpecification = maplibregl.FogSpecification;
  export type AnySourceData = maplibregl.AnySourceData;
  export type GeoJSONSource = maplibregl.GeoJSONSource;
  export type SourceQueryOptions = maplibregl.SourceQueryOptions;
}
