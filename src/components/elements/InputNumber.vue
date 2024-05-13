<script setup lang="ts">
const props = defineProps<{
  value?: number
  placeholder?: string
  disabled?: boolean
}>()
import { ref, watch } from 'vue'

const model = ref(0)

const emit = defineEmits(['update'])

watch(model, async (newValue) => {
  emit('update', newValue)
})
watch(props, (newValue) => {
  if (newValue.value) model.value = newValue.value
})
</script>
<template>
  <label class="form-label"><slot></slot></label>
  <input
    type="number"
    class="form-control"
    :placeholder="placeholder"
    v-model="model"
    :disabled="disabled"
  />
</template>
