<script setup lang="ts">
import Lang from '@/lang/index'
import DrawerPanel from '@/API/DrawerPanel'
import TileGrid from '@/map/TileGrid'
import MenuBox from '@/components/menu/MenuItems/MenuBox.vue'
import MenuItem from '@/components/menu/MenuItems/MenuItem.vue'
import { POIType } from '@/enum'
</script>
<template>
  <MenuBox>
    {{ Lang.BTN_DRAW }}
    <template #items>
      <MenuItem
        icon="mdi mdi-vector-square"
        @click="TileGrid.select()"
        :background="TileGrid.selectMode.value"
      >
        {{ Lang.BTN_DRAW_TILE }}
      </MenuItem>
      <MenuItem
        icon="mdi mdi-vector-polyline"
        @click="DrawerPanel.show(POIType.polyline)"
        :background="DrawerPanel.polyline.value"
      >
        {{ Lang.BTN_DRAW_LINE }}
      </MenuItem>
      <MenuItem
        icon="mdi mdi-vector-polygon"
        @click="DrawerPanel.show(POIType.polygon)"
        :background="DrawerPanel.polygon.value"
      >
        {{ Lang.BTN_DRAW_POLYGON }}
      </MenuItem>
      <MenuItem
        icon="mdi mdi-vector-rectangle"
        @click="DrawerPanel.show(POIType.square)"
        :background="DrawerPanel.square.value"
      >
        {{ Lang.BTN_DRAW_SQUARE }}
      </MenuItem>
    </template>
  </MenuBox>
</template>
