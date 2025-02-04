<script setup lang="ts">
import { ref, type Ref } from 'vue'
import Input from '@/components/elements/InputText.vue'
import InputNumber from '@/components/elements/InputNumber.vue'
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
import Select from '../elements/Select.vue'
import API from '@/API'
import type { SelectItem } from '@/interface'
defineProps<{
  defaults?: Ref<{ host: string; port: number }>
}>()
const emit = defineEmits(['update'])

const data = {
  type: 'tcp',
  host: '127.0.0.1',
  port: 9010,
  device: 'COM1'
}

let gpsType = ref('tcp')

const selItems: Array<SelectItem> = [
  { title: Lang.value.TXT_GPS_TCP, value: 'tcp' },
  { title: Lang.value.TXT_GPS_USB, value: 'usb' }
]
let USBDevList: Array<SelectItem> = []

async function makeUSBDevList() {
  const rawUSBList = await API.GPS.deviceList()
  if (rawUSBList) {
    USBDevList = []
    rawUSBList.forEach((valueL) => {
      if (valueL.manufacturer && valueL.path)
        USBDevList.push({ title: valueL.friendlyName || valueL.manufacturer, value: valueL.path })
    })
  }
}
</script>
<template>
  <FormLine>
    <Select
      :items="selItems"
      :defSelect="'tcp'"
      @update="
        (value: string) => {
          gpsType = value
          data.type = value
          console.log(gpsType)
          if (gpsType == 'usb') makeUSBDevList()
        }
      "
      >{{ Lang.TXT_GPS_TYPE_SELECT }}</Select
    >
  </FormLine>
  <template v-if="gpsType == 'tcp'">
    <FormLine
      ><Input
        :value="defaults?.value?.host"
        @update="(value: string) => ((data.host = value), emit('update', data))"
        >{{ Lang.TXT_HOST }}</Input
      ></FormLine
    >
    <FormLine
      ><InputNumber
        :value="defaults?.value?.port"
        @update="(value: number) => ((data.port = value), emit('update', data))"
        >{{ Lang.TXT_PORT }}</InputNumber
      ></FormLine
    ></template
  >
  <template v-if="gpsType == 'usb'">
    <FormLine>
      <Select
        :items="USBDevList"
        @update="
          (value: string) => {
            data.device = value
          }
        "
        >{{ Lang.TXT_GPS_USB_DEVICE }}</Select
      >
    </FormLine>
  </template>
</template>
