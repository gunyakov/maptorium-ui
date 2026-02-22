<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :maximized="$q.screen.lt.sm">
    <q-card class="q-dialog-plugin job-dialog-card">
      <q-card-section class="text-h6">
        {{ dialogTitle }}
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-tabs v-model="tab" dense align="left" class="text-primary">
          <q-tab name="download" :label="t('dialog.job.main.tabs.download')" />
          <q-tab name="network" :label="t('dialog.job.main.tabs.network')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="download" class="q-pa-none q-pt-md">
            <div class="row q-col-gutter-md no-wrap items-start">
              <div class="col">
                <q-select
                  v-model="download.mapID"
                  :options="mapOptions"
                  emit-value
                  map-options
                  outlined
                  dense
                  :label="t('dialog.job.main.map')"
                />

                <div class="q-mt-sm">
                  <q-checkbox
                    v-model="download.randomDownload"
                    :label="t('dialog.job.main.random_download')"
                  />
                </div>

                <div class="q-mt-sm">
                  <q-checkbox
                    v-model="download.updateTiles"
                    :label="t('dialog.job.main.overwrite_old_tiles')"
                  />
                </div>
                <div class="q-mt-sm">
                  <q-checkbox
                    v-model="download.updateDifferent"
                    :disable="!download.updateTiles"
                    :label="t('dialog.job.main.overwrite_different_tiles')"
                  />
                </div>

                <div class="q-mt-sm">
                  <q-checkbox
                    v-model="download.updateDateTiles"
                    :disable="!download.updateTiles"
                    :label="t('dialog.job.main.overwrite_before_date')"
                  />
                </div>
                <q-input
                  v-model="download.dateTiles"
                  type="date"
                  outlined
                  dense
                  :disable="!download.updateTiles || !download.updateDateTiles"
                />

                <div class="q-mt-sm">
                  <q-checkbox
                    v-model="download.emptyTiles"
                    :label="t('dialog.job.main.save_empty_tiles')"
                  />
                </div>
                <div class="q-mt-sm">
                  <q-checkbox
                    v-model="download.checkEmptyTiles"
                    :label="t('dialog.job.main.overwrite_empty_tiles')"
                  />
                </div>
                <div class="q-mt-sm">
                  <q-checkbox
                    v-model="download.updateDateEmpty"
                    :disable="!download.checkEmptyTiles"
                    :label="t('dialog.job.main.overwrite_before_date')"
                  />
                </div>
                <q-input
                  v-model="download.dateEmpty"
                  type="date"
                  outlined
                  dense
                  :disable="!download.checkEmptyTiles || !download.updateDateEmpty"
                />
              </div>

              <div class="zoom-column">
                <div class="text-subtitle2 q-mb-sm">{{ t('dialog.job.main.zoom') }}</div>
                <q-option-group
                  v-model="selectedZooms"
                  :options="zoomOptions"
                  type="checkbox"
                />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="network" class="q-pa-none q-pt-md">
            <div>
              <q-checkbox
                v-model="customNetworkConfig"
                :label="t('dialog.job.main.custom_network')"
              />
            </div>

            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="network.request.delay"
                  type="number"
                  outlined
                  dense
                  :disable="!customNetworkConfig"
                  :label="t('dialog.job.main.delay')"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="network.request.timeout"
                  type="number"
                  outlined
                  dense
                  :disable="!customNetworkConfig"
                  :label="t('dialog.job.main.timeout')"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="network.request.userAgent"
                  :options="userAgentOptions"
                  emit-value
                  map-options
                  use-input
                  fill-input
                  hide-selected
                  new-value-mode="add-unique"
                  outlined
                  dense
                  :disable="!customNetworkConfig"
                  :label="t('dialog.job.main.agent')"
                  @new-value="onNewUserAgent"
                />
              </div>
            </div>

            <div class="q-mt-sm">
              <q-checkbox
                v-model="network.banTimeMode"
                :disable="!customNetworkConfig"
                :label="t('dialog.job.main.ban_time_mode')"
              />
            </div>

            <div class="q-mt-sm">
              <q-checkbox
                v-model="network.proxy.enable"
                :disable="!customNetworkConfig"
                :label="t('dialog.job.main.proxy_custom')"
              />
            </div>

            <div class="row q-col-gutter-md q-mt-xs">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="network.proxy.server.protocol"
                  outlined
                  dense
                  :disable="!customNetworkConfig || !network.proxy.enable"
                  :label="t('dialog.job.main.proxy_protocol')"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="network.proxy.server.host"
                  outlined
                  dense
                  :disable="!customNetworkConfig || !network.proxy.enable"
                  :label="t('dialog.job.main.proxy_host')"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="network.proxy.server.port"
                  type="number"
                  outlined
                  dense
                  :disable="!customNetworkConfig || !network.proxy.enable"
                  :label="t('dialog.job.main.proxy_port')"
                />
              </div>
            </div>

            <div class="q-mt-sm">
              <q-checkbox
                v-model="network.proxy.authRequired"
                :disable="!customNetworkConfig || !network.proxy.enable"
                :label="t('dialog.job.main.proxy_auth')"
              />
            </div>

            <div class="row q-col-gutter-md q-mt-xs">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="network.proxy.auth.username"
                  outlined
                  dense
                  :disable="!customNetworkConfig || !network.proxy.enable || !network.proxy.authRequired"
                  :label="t('dialog.job.main.proxy_user')"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="network.proxy.auth.password"
                  outlined
                  dense
                  type="password"
                  :disable="!customNetworkConfig || !network.proxy.enable || !network.proxy.authRequired"
                  :label="t('dialog.job.main.proxy_password')"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          :disable="!download.mapID"
          :label="t('dialog.actions.ok')"
          @click="onOKClick"
        />
        <q-btn color="primary" :label="t('dialog.actions.cancel')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import type { ModalsList } from 'src/composables/useDialogs';
import { useI18n } from 'vue-i18n';
import { useMapsList } from 'src/composables/useMapsList';
import type { iJobInfo, iNetworkConfig } from 'src/interface';
import { DownloadMode } from 'src/enum';

defineOptions({
  name: 'JobDialog',
});

const { t } = useI18n();
const mapsList = useMapsList();

const props = defineProps<{
  modalName: ModalsList;
  polygonID: number;
  polygonPoints: Array<{ lat: number; lng: number }>;
}>();

const tab = ref<'download' | 'network'>('download');
const customNetworkConfig = ref(false);
const selectedZooms = ref<Array<number>>([]);

const download = ref<iJobInfo>({
  mapID: mapsList.currentBaseMap.value || '',
  randomDownload: false,
  updateTiles: false,
  updateDifferent: false,
  updateDateTiles: false,
  dateTiles: '',
  emptyTiles: false,
  checkEmptyTiles: false,
  updateDateEmpty: false,
  dateEmpty: '',
  zoom: {},
});

const network = ref<iNetworkConfig>({
  state: DownloadMode.enable,
  request: {
    userAgent: '',
    timeout: 30000,
    delay: 0,
  },
  banTimeMode: false,
  proxy: {
    enable: false,
    server: {
      protocol: '',
      host: '',
      port: 0,
    },
    authRequired: false,
    auth: {
      username: '',
      password: '',
    },
  },
});

const dialogTitle = computed(() => t(`dialog.${props.modalName}.title`));

const mapOptions = computed(() =>
  mapsList.rawMapsList.value.map((item) => ({
    label: item.title || item.name,
    value: item.id,
  })),
);

const zoomOptions = computed(() =>
  Array.from({ length: 17 }, (_, i) => 4 + i).map((zoom) => ({
    label: `Z${zoom < 10 ? '0' : ''}${zoom}`,
    value: zoom,
  })),
);

const userAgentOptions = ref<Array<{ label: string; value: string }>>([
  {
    label: 'Chrome 134 (Windows)',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  },
  {
    label: 'Chrome 134 (Linux)',
    value:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  },
  {
    label: 'Firefox 136 (Windows)',
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
  },
  {
    label: 'Firefox 136 (Linux)',
    value: 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0',
  },
  {
    label: 'Safari 18 (macOS)',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  },
  {
    label: 'Edge 134 (Windows)',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
  },
  {
    label: 'Mobile Chrome (Android)',
    value:
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
  },
]);

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

onMounted(async () => {
  if (mapsList.rawMapsList.value.length === 0) {
    await mapsList.refresh();
  }
  if (!download.value.mapID) {
    download.value.mapID = mapOptions.value[0]?.value ?? '';
  }
});

function onOKClick() {
  const zoomMap = selectedZooms.value.reduce<{ [id: number]: boolean }>((acc, zoom) => {
    acc[zoom] = true;
    return acc;
  }, {});

  onDialogOK({
    data: {
      polygonID: props.polygonID,
      polygon: props.polygonPoints,
      customNetworkConfig: customNetworkConfig.value,
      network: customNetworkConfig.value ? network.value : undefined,
      download: {
        ...download.value,
        zoom: zoomMap,
      },
    },
  });
}

function onNewUserAgent(value: string, done: (value?: string, mode?: 'add' | 'add-unique' | 'toggle') => void) {
  const customValue = value.trim();
  if (!customValue) {
    done();
    return;
  }
  done(customValue, 'add-unique');
}
</script>

<style scoped>
.job-dialog-card {
  width: min(95vw, 860px);
  max-width: 95vw;
  min-width: 0;
}

.zoom-column {
  flex: 0 0 170px;
  width: 170px;
}

@media (max-width: 600px) {
  .job-dialog-card {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
  }

  .zoom-column {
    flex: 0 0 140px;
    width: 140px;
  }
}
</style>
