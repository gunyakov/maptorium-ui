<script setup lang="ts">
import type { SelectItem } from '@/interface'
import Lang from '@/lang/index'
const props = defineProps<{
  placeholder?: string
  disabled?: boolean
  items: Array<SelectItem>
  defSelect?: string
  rootItem?: true
}>()
import { ref, watch } from 'vue'

const model = ref(props.defSelect?.toString())
const emit = defineEmits(['update'])
watch(
  () => props.defSelect,
  (newValue) => {
    if (newValue) model.value = newValue?.toString()
    //console.log('Change def select', model.value)
  }
)
watch(model, async (newValue) => {
  emit('update', newValue)
})
</script>
<template>
  <label class="form-label"><slot></slot></label>
  <select class="form-select" v-model="model">
    <option value="-1" :selected="model == '-1'">
      {{ placeholder || `${Lang.TXT_CHOOSE}...` }}
    </option>
    <option v-if="rootItem" value="0" :selected="model == '0'">
      {{ `${Lang.TXT_CATEGORY_ROOT}` }}
    </option>
    <template v-for="(item, key) in items" :key="key">
      <option :value="item.value" :selected="model == item.value.toString()">
        {{ item.title }}
      </option>
    </template>
  </select>
</template>
