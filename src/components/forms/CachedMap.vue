<script setup lang="ts">
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
import Select from '@/components/elements/Select.vue'
import API from '@/API/index'
import ButtonZoom from '@/components/modals/ModalItems/ButtonZoom.vue'
const buttons = [
  [4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21]
]

const emit = defineEmits(['update'])
const data = {
  mapID: '',
  zoom: 0
}
</script>
<template>
  <FormLine>
    <Select
      :defSelect="'-1'"
      :items="API.rawMapsList.value"
      @update="(value: string) => ((data.mapID = value), emit('update', data))"
      >{{ Lang.TXT_SELECT_MAP }}:</Select
    ></FormLine
  >
  <div class="d-flex flex-wrap gap-2 mb-3">
    <ButtonZoom
      v-for="item in buttons[0]"
      :key="'ZoomBtn' + item"
      @click="data.zoom = item"
      :dsmCancel="true"
      >{{ 'Z' + (item < 10 ? '0' : '') + item }}
    </ButtonZoom>
  </div>
  <div class="d-flex flex-wrap gap-2 mb-3">
    <ButtonZoom
      v-for="item in buttons[1]"
      :key="'ZoomBtn' + item"
      @click="data.zoom = item"
      :dsmCancel="true"
      >{{ 'Z' + item }}
    </ButtonZoom>
  </div>
  <div class="d-flex flex-wrap gap-2 mb-3">
    <ButtonZoom
      v-for="item in buttons[2]"
      :key="'ZoomBtn' + item"
      @click="data.zoom = item"
      :dsmCancel="true"
      >{{ 'Z' + item }}
    </ButtonZoom>
  </div>
</template>
