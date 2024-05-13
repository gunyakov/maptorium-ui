<script setup lang="ts">
import { ref, watch } from 'vue'
import Lang from '@/lang/index'
import ModalMain from '@/components/modals/ModalItems/Main.vue'
import TabGroup from '@/components/elements/TabGroup.vue'
import TabButton from '@/components/elements/TabButton.vue'
import TabContent from '@/components/elements/TabContent.vue'
import TabPane from '@/components/elements/TabPane.vue'

import CheckBox from '@/components/elements/CheckBox.vue'
import FormLine from '@/components/elements/FormLine.vue'

import DownloadForm from '@/components/forms/DownloadConfig.vue'
import FormNetwork from '@/components/forms/NetworkConfig.vue'
import type { iJobConfig, iJobInfo } from '@/interface'
import API from '@/API/index'
const customNetwork = ref(false)

let formData: iJobConfig = {
  polygonID: API.POI.poiID,
  customNetworkConfig: false,
  network: undefined,
  download: undefined
}

watch(
  () => API.POI.poiID,
  (value) => {
    formData.polygonID = value
  }
)
</script>
<template>
  <!--Modal for Download job-->
  <ModalMain
    id="jobModal"
    :actionBtn="true"
    :closeBtn="true"
    @submit="API.JobManager.Add(formData)"
  >
    {{ Lang.TXT_MODAL_DOWNLOAD_TILES }}
    <template #tabs>
      <TabGroup>
        <TabButton id="#downloadJobSettings" :active="true">{{ Lang.BTN_JOB }}</TabButton>
        <TabButton id="#downloadJobNetwork">{{ Lang.BTN_NETWORK }}</TabButton>
      </TabGroup>
    </template>
    <template #body>
      <TabContent id="jobTabContent">
        <input type="hidden" name="polygonID" value="0" id="polygonID" />
        <TabPane id="downloadJobSettings" :active="true">
          <DownloadForm @update="(value: iJobInfo) => (formData.download = value)" />
        </TabPane>
        <TabPane id="downloadJobNetwork">
          <FormLine>
            <CheckBox
              @update="(value: boolean) => (formData.customNetworkConfig = customNetwork = value)"
              >{{ Lang.TXT_NETWORK_CUSTOM }}</CheckBox
            >
          </FormLine>
          <FormNetwork @update="(value) => (formData.network = value)" :disabled="!customNetwork" />
        </TabPane>
      </TabContent>
    </template>
  </ModalMain>
  <!--/Modal for Download job-->
</template>
