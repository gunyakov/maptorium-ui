<script setup lang="ts">
import { DistanceUnits } from '@/enum'
import { watch, ref, type Ref } from 'vue'
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
import Select from '@/components/elements/Select.vue'
import Input from '@/components/elements/InputNumber.vue'
interface DistanceToGo {
  distance: number
  units: keyof typeof DistanceUnits
}
const prop = defineProps<{
  defaults?: Ref<DistanceToGo>
}>()
const emit = defineEmits(['update'])

const unitsList = ref([
  { title: Lang.value.TXT_NMILE, value: 'nmile' },
  { title: Lang.value.TXT_YARD, value: 'yard' },
  { title: Lang.value.TXT_MILE, value: 'mile' },
  { title: Lang.value.TXT_FOOT, value: 'foot' },
  { title: Lang.value.TXT_KILOMETER, value: 'kilometer' },
  { title: Lang.value.TXT_METER, value: 'meter' }
])
watch(Lang.value, (value) => {
  Object.keys(unitsList.value).forEach((item) => {
    unitsList.value[item] = value[`TXT_${item.toUpperCase()}`]
  })
})

const data: DistanceToGo = {
  distance: 0,
  units: 'meter'
}
</script>
<template>
  <FormLine>
    <Input
      :value="defaults?.value?.distance"
      @update="(value: number) => ((data.distance = value), emit('update', data))"
      >{{ Lang.TXT_GPS_DISTANCE_GO }}</Input
    >
  </FormLine>
  <FormLine
    ><Select
      defSelect="meter"
      :items="unitsList"
      @update="(value: keyof typeof DistanceUnits) => ((data.units = value), emit('update', data))"
      >{{ Lang.TXT_UNITS }}
    </Select></FormLine
  >
</template>
