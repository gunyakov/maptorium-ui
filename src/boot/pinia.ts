import { defineBoot } from '#q-app/wrappers';
import { Dark } from 'quasar';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import { watch } from 'vue';
import GPS from 'src/API/GPS';
import { createMap } from 'src/map/Map';
import { getI18nInstance } from 'src/i18n';
import { useSettingsStore } from 'src/stores/settings';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ app } /* { app, router, ... } */) => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedState);
  app.use(pinia);

  const settings = useSettingsStore();
  // Ensure side panels are closed on startup (override any older persisted values)
  settings.jobManager = false;
  settings.poiManager = false;
  if (settings.locale) {
    const i18n = getI18nInstance();
    if (typeof i18n.global.locale === 'string') {
      i18n.global.locale = settings.locale;
    } else {
      i18n.global.locale.value = settings.locale;
    }
  }

  Dark.set(settings.darkMode);
  watch(
    () => settings.darkMode,
    (value) => {
      Dark.set(value);
    },
  );

  GPS.setUnits(settings.units);

  createMap();
});
