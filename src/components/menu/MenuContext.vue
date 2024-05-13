<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API'
import MenuContext from '@/API/MenuContext'
import MenuItem from '@/components/menu/MenuItems/ContextMenuItem.vue'
import { POIType } from '@/enum'
</script>
<template>
  <ul
    class="dropdown-menu context-menu"
    :style="{
      display: MenuContext.showContext ? 'block' : 'none',
      top: `${MenuContext.y}px`,
      left: `${MenuContext.x}px`
    }"
  >
    <MenuItem icon="mdi mdi-pin-outline" target="#POIAddModal" @click="MenuContext.hide()">{{
      Lang.TXT_ADD_POI
    }}</MenuItem>
    <!--<div class="dropdown-divider"></div>
    <li class="dropdown">
      <a
        class="dropdown-item has-arrow"
        href="#"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        ><i class="mdi mdi-download-multiple"></i><span class="">&nbsp;Force...</span></a
      >
      <ul class="dropdown-menu" style="z-index: 10000; position: absolute">
        <li class="dropdown">
          <a
            class="dropdown-item"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            ><i class="mdi mdi-download-multiple"></i
            ><span class="">&nbsp;Force download map tile to cache</span></a
          >
        </li>
        <li class="dropdown">
          <a
            class="dropdown-item"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            ><i class="mdi mdi-download-multiple"></i
            ><span class="">&nbsp;Force download overlay tile to cache</span></a
          >
        </li>
        <li class="dropdown">
          <a
            class="dropdown-item"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            ><i class="mdi mdi-download-multiple"></i
            ><span class="">&nbsp;Force download visible map tile to cache</span></a
          >
        </li>
        <li class="dropdown">
          <a
            class="dropdown-item"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            ><i class="mdi mdi-download-multiple"></i
            ><span class="">&nbsp;Force download visible overlay tile to cache</span></a
          >
        </li>
      </ul>
    </li>-->
    <template v-if="API.POI.poiID > 0">
      <div class="dropdown-divider"></div>
      <MenuItem icon="mdi mdi-application-cog" @click="API.POI.Update(), MenuContext.hide()"
        >{{ Lang.TXT_PROPERTIES_POI }}...</MenuItem
      >
      <!--<MenuItem icon="mdi mdi-circle-edit-outline" @click="MenuContext.hide()">Edit...</MenuItem>
      <MenuItem
        v-if="API.POI.poiType == POIType.polygon"
        icon="mdi mdi-arrange-send-backward"
        @click="MenuContext.hide()"
        >Bring to back</MenuItem
      >
      <MenuItem
        v-if="API.POI.poiType == POIType.polygon"
        icon="mdi mdi-checkerboard-plus"
        @click="MenuContext.hide()"
        >Add to merge bar</MenuItem
      >-->
      <MenuItem
        v-if="API.POI.poiType == POIType.polygon"
        icon="mdi mdi-auto-download"
        target="#jobModal"
        @click="MenuContext.hide()"
        >{{ Lang.TXT_DOWNLOAD_JOB_START }}...</MenuItem
      >
      <!--<MenuItem
        v-if="API.POI.poiType == POIType.polygon"
        icon="mdi mdi-auto-download"
        @click="MenuContext.hide()"
        >Generate map...</MenuItem
      >-->
      <MenuItem
        v-if="API.POI.poiType == POIType.polygon"
        icon="mdi mdi-data-matrix-plus"
        @click="API.POI.CachedMap(), MenuContext.hide()"
        >{{ Lang.TXT_CACHED_MAP }}...</MenuItem
      >
      <div class="dropdown-divider"></div>
      <MenuItem icon="mdi mdi-delete-outline" @click="MenuContext.hide(), API.POI.Delete()">{{
        Lang.TXT_DELETE
      }}</MenuItem>
    </template>
  </ul>
</template>
<style>
.context-menu {
  z-index: 10000;
  position: absolute;
  inset: 480px auto auto 591px;
}
</style>
