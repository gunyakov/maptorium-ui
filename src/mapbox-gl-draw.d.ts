import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

declare global {
  type MapboxDrawMode =
    | 'simple_select'
    | 'direct_select'
    | 'draw_point'
    | 'draw_line_string'
    | 'draw_polygon'
    | 'static';

  interface MapboxDrawChangeModeOptions {
    featureIds?: Array<string | number>;
    featureId?: string | number;
    coordPath?: string;
    from?: Feature | Geometry | number[];
  }

  interface MapboxDrawControls {
    point?: boolean;
    line_string?: boolean;
    polygon?: boolean;
    trash?: boolean;
    combine_features?: boolean;
    uncombine_features?: boolean;
  }

  interface MapboxDrawOptions {
    displayControlsDefault?: boolean;
    controls?: MapboxDrawControls;
    defaultMode?: MapboxDrawMode;
    userProperties?: boolean;
    styles?: unknown[];
  }

  interface MapboxDrawInstance extends maplibregl.IControl {
    changeMode(mode: MapboxDrawMode, options?: MapboxDrawChangeModeOptions): MapboxDrawInstance;
    getMode(): MapboxDrawMode;
    getAll(): FeatureCollection;
    deleteAll(): MapboxDrawInstance;
    trash(): MapboxDrawInstance;
    add(feature: Feature | FeatureCollection): string[];
    get(featureId: string | number): Feature<Geometry, GeoJsonProperties> | undefined;
    delete(featureIds: string | number | Array<string | number>): MapboxDrawInstance;
  }

  interface MapboxDrawConstructor {
    new (options?: MapboxDrawOptions): MapboxDrawInstance;
  }

  const MapboxDraw: MapboxDrawConstructor;

  interface Window {
    MapboxDraw: MapboxDrawConstructor;
  }
}

export {};
