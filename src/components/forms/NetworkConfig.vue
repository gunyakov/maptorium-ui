<script setup lang="ts">
import Lang from '@/lang/index'
import CheckBox from '@/components/elements/CheckBox.vue'
import FormLine from '@/components/elements/FormLine.vue'
import InputLoginGroup from '@/components/elements/InputLoginGroup.vue'
import InputProxyGroup from '@/components/elements/InputProxyGroup.vue'
import InputText from '@/components/elements/InputText.vue'
defineProps<{
  disabled?: boolean
}>()
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { iNetworkConfig } from '@/interface'
import { DownloadMode } from '@/enum'
const emit = defineEmits(['update'])
const proxyEnabled: Ref<boolean> = ref(false)
const proxyAuth: Ref<boolean> = ref(false)

const network: iNetworkConfig = {
  state: DownloadMode.enable,
  request: {
    userAgent: '',
    timeout: 30000,
    delay: 0
  },
  banTimeMode: false,
  proxy: {
    enable: false,
    server: {
      protocol: '',
      host: '',
      port: 0
    },
    authRequired: false,
    auth: {
      username: '',
      password: ''
    }
  }
}
</script>
<template>
  <FormLine class="offset-sm-0">
    <InputText
      :placeholder="Lang.TXT_DELAY_PLACHEHOLDER"
      @update="(value: number) => ((network.request.delay = value), emit('update', network))"
      :disabled="disabled"
      >{{ Lang.TXT_DELAY }}</InputText
    >
  </FormLine>
  <FormLine class="offset-sm-0">
    <InputText
      :placeholder="Lang.TXT_TIMEOUT_PLACEHOLDER"
      @update="(value: number) => ((network.request.timeout = value), emit('update', network))"
      :disabled="disabled"
      >{{ Lang.TXT_TIMEOUT }}</InputText
    >
  </FormLine>
  <FormLine class="offset-sm-0">
    <InputText
      :placeholder="Lang.TXT_AGENT_PLACEHOLDER"
      @update="(value: string) => ((network.request.userAgent = value), emit('update', network))"
      :disabled="disabled"
      >{{ Lang.TXT_AGENT }}</InputText
    >
  </FormLine>
  <FormLine class="offset-sm-0">
    <CheckBox
      @update="(value: boolean) => ((network.banTimeMode = value), emit('update', network))"
      :disabled="disabled"
      >{{ Lang.TXT_BAN_TIME_MODE }}</CheckBox
    >
  </FormLine>
  <FormLine class="offset-sm-0">
    <CheckBox
      @update="
        (value: boolean) => ((network.proxy.enable = proxyEnabled = value), emit('update', network))
      "
      :disabled="disabled"
      >{{ Lang.TXT_PROXY_CUSTOM }}</CheckBox
    >
  </FormLine>
  <FormLine class="offset-sm-0">
    <InputProxyGroup
      @update="(value) => ((network.proxy.server = value), emit('update', network))"
      :disabled="!proxyEnabled || disabled"
  /></FormLine>
  <FormLine class="offset-sm-0">
    <CheckBox
      @update="
        (value: boolean) => (
          (network.proxy.authRequired = proxyAuth = value), emit('update', network)
        )
      "
      :disabled="!proxyEnabled || disabled"
      >{{ Lang.TXT_PROXY_AUTH }}</CheckBox
    >
  </FormLine>
  <FormLine class="offset-sm-0">
    <InputLoginGroup
      @update="(value) => ((network.proxy.auth = value), emit('update', network))"
      :disabled="!proxyAuth || !proxyEnabled || disabled"
  /></FormLine>
</template>
