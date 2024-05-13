<script setup lang="ts">
const props = defineProps<{
  value?: string
}>()
import { ref, watch } from 'vue'
const color = ref('')
const emit = defineEmits(['update'])
watch(props, async (newValue) => {
  color.value = newValue.value || '#000000'
})
watch(color, (newValue) => {
  emit('update', newValue)
})
</script>
<template>
  <div class="col-sm-6">
    <label class="form-label"><slot></slot></label>

    <div class="input-group">
      <span class="input-group-text" style="padding: 0 0"
        ><input
          type="color"
          class="form-control form-control-color w-100"
          v-model="color"
          style="border: 0px"
      /></span>
      <input
        type="text"
        class="form-control"
        placeholder="#000000"
        aria-label="#000000"
        v-model="color"
      />
    </div>
  </div>
</template>
