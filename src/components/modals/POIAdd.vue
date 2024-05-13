<script setup lang="ts">
import Lang from '@/lang/index'
import ModalMain from '@/components/modals/ModalItems/Main.vue'
import FormPOIAdd from '@/components/forms/POIAdd.vue'
import API from '@/API/index'
import type { POIInfo } from '@/interface'

let poiInfo: POIInfo | null = null
</script>
<template>
  <!--Modal for POI properties-->
  <ModalMain id="POIAddModal" :actionBtn="true" :closeBtn="true" @submit="API.POI.Add(poiInfo)">
    {{ Lang.TXT_ADD_POI }}
    <template #body>
      <FormPOIAdd @update="(value) => (poiInfo = value)" />
    </template>
  </ModalMain>
  <!--/Modal for POI properties-->
</template>
