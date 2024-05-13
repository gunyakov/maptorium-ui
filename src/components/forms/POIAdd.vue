<script setup lang="ts">
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
import Select from '@/components/elements/Select.vue'
import InputText from '@/components/elements/InputText.vue'
import API from '@/API/index'
const emit = defineEmits(['update'])
const poiConf = {
  categoryID: 0,
  name: 'NewPOI',
  type: 'point',
  points: []
}
</script>
<template>
  <FormLine>
    <Select
      :defSelect="'0'"
      :items="API.POI.categoryList.value"
      :rootItem="true"
      @update="(value: number) => ((poiConf.categoryID = value), emit('update', poiConf))"
      >{{ Lang.TXT_CATEGORY }}:</Select
    ></FormLine
  >
  <FormLine
    ><InputText
      :placeholder="Lang.TXT_NAME_PLACEHOLDER"
      @update="(value: string) => ((poiConf.name = value), emit('update', poiConf))"
      >{{ Lang.TXT_NAME }}</InputText
    ></FormLine
  >
</template>
