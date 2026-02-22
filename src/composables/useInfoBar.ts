import { onBeforeUnmount, onMounted, ref } from 'vue';
import socket from 'src/API/Socket';
import { ConvertDEGToDMS, formatBytes } from 'src/helpers/formaters';
import type { Statistic } from 'src/interface';
import { useSettingsStore } from 'src/stores/settings';

const queue = ref(0);
const download = ref(0);
const size = ref('0 Bytes');
const lat = ref('');
const lng = ref('');
const zoom = ref('0.00');

let activeConsumers = 0;
let statHandler: ((stat: Statistic) => void) | null = null;

function attachSocketStatListener() {
  if (statHandler) return;

  statHandler = (stat: Statistic) => {
    queue.value = stat.queue;
    download.value = stat.download;
    size.value = formatBytes(stat.size);
  };

  socket.on('stat', statHandler);
}

function detachSocketStatListener() {
  if (!statHandler) return;
  socket.off('stat', statHandler);
  statHandler = null;
}

export function setInfoBarCoords(latitude: number, longitude: number) {
  lat.value = ConvertDEGToDMS(latitude, true);
  lng.value = ConvertDEGToDMS(longitude, false);
}

export function setInfoBarZoom(value: number) {
  if (!Number.isFinite(value)) return;
  zoom.value = value.toFixed(2);
}

export function useInfoBar() {
  const settingsStore = useSettingsStore();

  if (!lat.value || !lng.value) {
    setInfoBarCoords(settingsStore.lat, settingsStore.lng);
  }
  setInfoBarZoom(settingsStore.zoom);

  onMounted(() => {
    activeConsumers += 1;
    if (activeConsumers === 1) {
      attachSocketStatListener();
    }
  });

  onBeforeUnmount(() => {
    activeConsumers = Math.max(0, activeConsumers - 1);
    if (activeConsumers === 0) {
      detachSocketStatListener();
    }
  });

  return {
    queue,
    download,
    size,
    lat,
    lng,
    zoom,
  };
}
