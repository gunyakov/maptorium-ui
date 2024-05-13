<script setup lang="ts">
import { ref } from 'vue'
import Buttons from '@/components/elements/POIManager/Buttons.vue'
import type { ManagerList } from '@/interface'
import Item from '@/components/elements/POIManager/Item.vue'
import ItemSub from '@/components/elements/POIManager/ItemSub.vue'
import API from '@/API'
import { ManagerItemType } from '@/enum'

defineProps<{
  id?: number
  items?: Array<ManagerList>
}>()

const emit = defineEmits(['add', 'remove', 'edit'])
const vissible = ref(false)
const buttons = ref(false)
</script>
<template>
  <li class="treeview-animated-items">
    <a
      :class="{ open: vissible }"
      class="closed"
      @click="vissible = !vissible"
      @mouseenter="buttons = true"
      @mouseleave="buttons = false"
    >
      <span
        ><i class="far mx-1" :class="vissible ? 'fa-folder-open' : 'fa-folder'"></i><slot></slot
      ></span>
      <Buttons
        v-if="buttons"
        :full="true"
        @add="emit('add', id)"
        @remove="emit('remove', id)"
        @edit="emit('edit', id)"
      />
    </a>

    <ul
      class="nested"
      :class="{ active: vissible }"
      :style="{ display: vissible ? 'block' : 'none' }"
      style="box-sizing: border-box"
    >
      <template v-for="(item, index) in items" :key="index">
        <Item
          v-if="item.type == ManagerItemType.item"
          icon="far fa-comment"
          @edit="API.POI.Update(item.ID)"
          @remove="API.POI.Delete(item.ID)"
          >{{ item.name }}</Item
        >
        <ItemSub
          v-if="item.type == ManagerItemType.folder"
          icon="far fa-envelope-open"
          :items="item.items"
          :id="item.ID"
          @add="(parentID: number) => emit('add', parentID)"
          @remove="(ID: number) => emit('remove', ID)"
          @edit="(ID: number) => emit('edit', ID)"
        >
          {{ item.name }}
        </ItemSub>
      </template>
    </ul>
  </li>
</template>
