<script setup lang="ts">
import API from '@/API/index'
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
import Select from '@/components/elements/Select.vue'
import InputText from '@/components/elements/InputText.vue'
import InputNumber from '@/components/elements/InputNumber.vue'
import ColorPicker from '@/components/elements/ColorPicker.vue'
import type { POIInfo } from '@/interface'
import type { Ref } from 'vue'
const emit = defineEmits(['update'])
defineProps<{
  defaults?: Ref<POIInfo>
}>()
const poiConf = {
  categoryID: 1,
  name: 'New POI',
  color: '#0D99FF',
  width: 1,
  fillColor: '#0D99FF',
  fillOpacity: 0.5
}
</script>
<template>
  <FormLine>
    <Select
      :defSelect="defaults?.value?.categoryID.toString()"
      :items="API.POI.categoryList.value"
      :rootItem="true"
      @update="(value: number) => ((poiConf.categoryID = value), emit('update', poiConf))"
      >{{ Lang.TXT_CATEGORY }}:</Select
    ></FormLine
  >
  <FormLine
    ><InputText
      :value="defaults?.value?.name"
      :placeholder="Lang.TXT_NAME_PLACEHOLDER"
      @update="(value: string) => ((poiConf.name = value), emit('update', poiConf))"
      >{{ Lang.TXT_NAME }}</InputText
    ></FormLine
  >
  <FormLine :row="true"
    ><ColorPicker
      :value="defaults?.value?.color"
      @update="(value: string) => ((poiConf.color = value), emit('update', poiConf))"
    >
      {{ Lang.TXT_COLOR }}</ColorPicker
    ><ColorPicker
      :value="defaults?.value?.fillColor"
      @update="(value: string) => ((poiConf.fillColor = value), emit('update', poiConf))"
    >
      {{ Lang.TXT_COLOR_FILL }}</ColorPicker
    ></FormLine
  >
  <FormLine :row="true"
    ><div class="col-sm-6">
      <InputNumber
        :value="defaults?.value?.width"
        :placeholder="Lang.TXT_WIDTH"
        @update="(value: number) => ((poiConf.width = value), emit('update', poiConf))"
        >{{ Lang.TXT_WIDTH }}</InputNumber
      >
    </div>
    <div class="col-sm-6">
      <InputNumber
        :value="defaults?.value?.fillOpacity"
        :placeholder="Lang.TXT_OPACITY"
        @update="(value: number) => ((poiConf.fillOpacity = value), emit('update', poiConf))"
        >{{ Lang.TXT_OPACITY }}</InputNumber
      >
    </div>
  </FormLine>
</template>
