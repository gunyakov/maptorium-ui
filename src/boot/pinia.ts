import { defineBoot } from '#q-app/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
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
  if (settings.locale) {
    const i18n = getI18nInstance();
    if (typeof i18n.global.locale === 'string') {
      i18n.global.locale = settings.locale;
    } else {
      i18n.global.locale.value = settings.locale;
    }
  }

  GPS.setUnits(settings.units);

  createMap();
});
