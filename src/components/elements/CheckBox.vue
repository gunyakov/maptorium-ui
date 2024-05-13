<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
import { ref, watch } from 'vue'

const model = ref(false)
const emit = defineEmits(['update'])
watch(model, async (newValue) => {
  emit('update', newValue)
})
</script>
<template>
  <div class="form-check">
    <input class="form-check-input" type="checkbox" v-model="model" :disabled="disabled" />
    <label class="form-check-label"> <slot></slot></label>
  </div>
</template>
