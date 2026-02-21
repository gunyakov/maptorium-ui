import { defineStore } from 'pinia';
import type { DistanceUnits, SquareUnits } from 'src/enum';
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    lat: 42.69751,
    lng: 23.32415,
    zoom: 12,
    locale: 'gb',
    units: 'nmile' as keyof typeof DistanceUnits,
    square: ['hectare'] as Array<keyof typeof SquareUnits>,
    logsLength: 10,
  }),
  actions: {
    set_coordinates(lat: number, lng: number) {
      this.lat = lat;
      this.lng = lng;
    },
    set_zoom(zoom: number) {
      this.zoom = zoom;
    },
    set_locale(locale: string) {
      this.locale = locale;
    },
    set_units(units: keyof typeof DistanceUnits) {
      this.units = units;
    },
    set_square(square: keyof typeof SquareUnits) {
      if (this.square.includes(square)) {
        this.square = this.square.filter((item) => item !== square);
      } else {
        this.square = [...this.square, square];
      }
    },
    reset_coords() {
      this.lat = 42.69751;
      this.lng = 23.32415;
      this.zoom = 12;
    },
    getBaseURL() {
      return 'http://127.0.0.1:9009';
      //return window.location.origin;
    },
    getVersion() {
      return '2.1.0';
    },
  },
  persist: true,
});

// Export the type of the store instance
export type SettingsStore = ReturnType<typeof useSettingsStore>;
