<script setup lang="ts">
import { type Ref } from 'vue'
import Input from '@/components/elements/InputText.vue'
import InputNumber from '@/components/elements/InputNumber.vue'
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
defineProps<{
  defaults?: Ref<{ host: string; port: number }>
}>()
const emit = defineEmits(['update'])

const data = {
  host: '127.0.0.1',
  port: 9010
}
</script>
<template>
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
  >
</template>
