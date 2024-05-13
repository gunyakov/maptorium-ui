<script setup lang="ts">
import Lang from '@/lang/index'
import ModalMain from '@/components/modals/ModalItems/Main.vue'
import ButtonZoom from '@/components/modals/ModalItems/ButtonZoom.vue'
import TileGrid from '@/map/TileGrid'
const buttons = [
  [4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21]
]
</script>
<template>
  <!-- TileGridModal -->
  <ModalMain id="tileGridModal">
    {{ Lang.TXT_MODAL_ZOOM }}
    <template #body>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <ButtonZoom
          v-for="item in buttons[0]"
          :key="'ZoomBtn' + item"
          @click="TileGrid.setZoom(item)"
          >{{ 'Z' + (item < 10 ? '0' : '') + item }}
        </ButtonZoom>
      </div>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <ButtonZoom
          v-for="item in buttons[1]"
          :key="'ZoomBtn' + item"
          @click="TileGrid.setZoom(item)"
          >{{ 'Z' + item }}
        </ButtonZoom>
      </div>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <ButtonZoom
          v-for="item in buttons[2]"
          :key="'ZoomBtn' + item"
          @click="TileGrid.setZoom(item)"
          >{{ 'Z' + item }}
        </ButtonZoom>
      </div>
    </template>
  </ModalMain>
  <!--/TileGridModal -->
</template>
