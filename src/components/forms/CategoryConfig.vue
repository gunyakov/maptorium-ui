<script setup lang="ts">
import API from '@/API/index'
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
import Select from '@/components/elements/Select.vue'
import InputText from '@/components/elements/InputText.vue'
import type { CategoryItem } from '@/interface'
import type { Ref } from 'vue'
defineProps<{
  defaults?: Ref<CategoryItem>
}>()
const emit = defineEmits(['update'])

const categoryConf = {
  parentID: -1,
  name: ''
}
</script>
<template>
  <FormLine>
    <Select
      :defSelect="defaults?.value?.parentID.toString()"
      :items="API.POI.categoryList.value"
      :rootItem="true"
      @update="(value: number) => ((categoryConf.parentID = value), emit('update', categoryConf))"
      >{{ Lang.TXT_CATEGORY }}:</Select
    ></FormLine
  >
  <FormLine
    ><InputText
      :value="defaults?.value?.name"
      :placeholder="Lang.TXT_NAME_PLACEHOLDER"
      @update="(value: string) => ((categoryConf.name = value), emit('update', categoryConf))"
      >{{ Lang.TXT_NAME }}</InputText
    ></FormLine
  >
</template>
