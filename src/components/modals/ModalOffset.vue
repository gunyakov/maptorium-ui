<script setup lang="ts">
import Lang from '@/lang/index'
import ModalMain from '@/components/modals/ModalItems/Main.vue'
import ButtonZoom from '@/components/modals/ModalItems/ButtonZoom.vue'
import TileGrid from '@/map/TileGrid'
const buttons = [0, 1, 2, 3, 4, 5]
</script>
<template>
  <!-- TileGridModal -->
  <ModalMain id="tileOffsetModal">
    {{ Lang.TXT_MODAL_ZOOM }}
    <template #body>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <ButtonZoom
          v-for="item in buttons"
          :key="'ZoomBtn' + item"
          @click="TileGrid.setZoomOffset(item)"
          >{{ '+' + item }}
        </ButtonZoom>
      </div>
    </template>
  </ModalMain>
  <!--/TileGridModal -->
</template>
