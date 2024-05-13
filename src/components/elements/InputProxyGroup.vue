<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
import Lang from '@/lang/index'
import { ref, watch } from 'vue'

const protocol = ref('')
const host = ref('')
const port = ref(0)
const emit = defineEmits(['update'])
watch(protocol, async (newValue) => {
  emit('update', { protocol: newValue, host: host.value, port: port.value })
})
watch(host, async (newValue) => {
  emit('update', { protocol: protocol.value, host: newValue, port: port.value })
})
watch(port, async (newValue) => {
  emit('update', { protocol: protocol.value, host: host.value, port: newValue })
})
</script>
<template>
  <div class="input-group">
    <select class="form-control" v-model="protocol" :disabled="disabled">
      <option>http</option>
      <option>https</option>
      <option>socks</option>
      <option>socks4</option>
      <option>socks5</option>
    </select>
    <span class="input-group-text">://</span>
    <input
      type="text"
      class="form-control"
      :placeholder="Lang.TXT_HOST"
      :aria-label="Lang.TXT_HOST"
      v-model="host"
      :disabled="disabled"
    />
    <span class="input-group-text">:</span>
    <input
      type="text"
      class="form-control"
      :placeholder="Lang.TXT_PORT"
      :aria-label="Lang.TXT_PORT"
      v-model="port"
      :disabled="disabled"
    />
  </div>
</template>
