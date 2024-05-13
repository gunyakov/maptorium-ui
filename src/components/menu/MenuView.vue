<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API/index'
import MenuBox from '@/components/menu/MenuItems/MenuBox.vue'
import MenuItem from '@/components/menu/MenuItems/MenuItem.vue'
import MenuItemSub from '@/components/menu/MenuItems/MenuItemSub.vue'
import TileGrid from '@/map/TileGrid'
</script>
<template>
  <MenuBox>
    {{ Lang.BTN_VIEW }}
    <template #items>
      <MenuItemSub icon="mdi mdi-view-grid-plus-outline" id="viewBoundaries">
        {{ Lang.BTN_VIEW_TILE_BOUNDARIES }}
        <template #items>
          <MenuItem icon="mdi mdi-grid" data-bs-toggle="modal" data-bs-target="#tileGridModal">
            {{ Lang.BTN_VIEW_ZOOM_LEVEL }}
          </MenuItem>
          <MenuItem
            icon="mdi mdi-grid-large"
            data-bs-toggle="modal"
            data-bs-target="#tileOffsetModal"
          >
            {{ Lang.BTN_VIEW_ZOOM_OFFSET }}
          </MenuItem>
          <MenuItem icon="mdi mdi-grid-off" @click="TileGrid.remove()">{{
            Lang.BTN_CLEAN
          }}</MenuItem>
        </template>
      </MenuItemSub>
      <MenuItemSub icon="mdi mdi-file-image" id="viewCache">
        {{ Lang.BTN_VIEW_TILE_CACHE }}
        <template #items>
          <MenuItem icon="mdi mdi-grid">
            {{ Lang.BTN_VIEW_ZOOM_LEVEL }}
          </MenuItem>
          <MenuItem icon="mdi mdi-grid-large">
            {{ Lang.BTN_VIEW_ZOOM_OFFSET }}
          </MenuItem>
          <MenuItem icon="mdi mdi-grid-off">{{ Lang.BTN_CLEAN }}</MenuItem>
        </template>
      </MenuItemSub>
    </template>
  </MenuBox>
</template>
