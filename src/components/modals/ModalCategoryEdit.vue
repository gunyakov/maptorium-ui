<script setup lang="ts">
import Lang from '@/lang/index'
import ModalMain from '@/components/modals/ModalItems/Main.vue'
import FormCategoryConf from '@/components/forms/CategoryConfig.vue'
import type { POIInfo } from '@/interface'
import API from '@/API/index'
let categoryInfo: { parentID: number; name: string } | null = null
</script>
<template>
  <!--Modal for Category properties-->
  <ModalMain
    id="CategoryEditModal"
    :actionBtn="true"
    :closeBtn="true"
    @submit="API.POI.UpdateCategory(categoryInfo)"
    :class="modal"
  >
    {{ Lang.TXT_PROPERTIES_POI }}
    <template #body>
      <FormCategoryConf @update="(value: POIInfo) => (categoryInfo = value)" />
    </template>
  </ModalMain>
</template>
