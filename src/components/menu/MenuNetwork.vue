<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API/index'
import { NetworkMode } from '@/enum'
import MenuBox from '@/components/menu/MenuItems/MenuBox.vue'
import MenuItem from '@/components/menu/MenuItems/MenuItem.vue'
</script>
<template>
  <MenuBox>
    {{ Lang.TXT_MODE }}
    <template #items>
      <MenuItem
        icon="mdi mdi-lan-pending"
        :background="API.mode.value == NetworkMode.enable"
        @click="API.NetworkMode(NetworkMode.enable)"
      >
        {{ Lang.BTN_MODE_INTERNET }}
      </MenuItem>
      <MenuItem
        icon="mdi mdi-lan-disconnect"
        :background="API.mode.value == NetworkMode.disable"
        @click="API.NetworkMode(NetworkMode.disable)"
      >
        {{ Lang.BTN_MODE_CACHE }}
      </MenuItem>
      <MenuItem
        icon="mdi mdi-lan-connect"
        :background="API.mode.value == NetworkMode.force"
        @click="API.NetworkMode(NetworkMode.force)"
      >
        {{ Lang.BTN_MODE_FORCE }}
      </MenuItem>
    </template>
  </MenuBox>
</template>
