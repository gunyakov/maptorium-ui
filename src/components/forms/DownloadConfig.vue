<script setup lang="ts">
import { ref } from 'vue'
import API from '@/API/index'
import Lang from '@/lang/index'
import DataPicker from '@/components/elements/DataPicker.vue'
import Select from '@/components/elements/Select.vue'

import FormLine from '@/components/elements/FormLine.vue'
import CheckBox from '@/components/elements/CheckBox.vue'
import Line from '@/components/elements/Line.vue'
import type { iJobInfo } from '@/interface'
const emit = defineEmits(['update'])

const enabledZooms = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const downloadConf: iJobInfo = {
  mapID: '',
  randomDownload: false,
  updateTiles: false,
  updateDifferent: false,
  updateDateTiles: false,
  dateTiles: '',
  emptyTiles: false,
  checkEmptyTiles: false,
  updateDateEmpty: false,
  dateEmpty: '',
  zoom: {}
}

const updateOldTiles = ref(false)
const updateOldTilesTime = ref(false)
const updateEmptyTiles = ref(false)
const updateEmptyTilesTime = ref(false)
</script>

<template>
  <div class="row row-cols-2 g-0">
    <div class="col-sm-10">
      <h5 class="font-size-14 mb-3">
        <i class="mdi mdi-arrow-right text-primary me-1"></i>
        {{ Lang.TXT_OPTIONS }}
      </h5>
      <FormLine>
        <Select
          :defSelect="'0'"
          :items="API.rawMapsList.value"
          @update="(value: string) => ((downloadConf.mapID = value), emit('update', downloadConf))"
          >Map:</Select
        >
      </FormLine>
      <label class="form-check-label"> Number of tiles: 0 </label>
      <Line length="100%" />

      <FormLine
        ><CheckBox
          @update="
            (value: boolean) => (
              (downloadConf.randomDownload = value), emit('update', downloadConf)
            )
          "
          >{{ Lang.TXT_RANDOM_DOWNLOAD_MODE }}</CheckBox
        ></FormLine
      >

      <FormLine>
        <CheckBox
          @update="
            (value: boolean) => (
              (downloadConf.updateTiles = updateOldTiles = value), emit('update', downloadConf)
            )
          "
          >{{ Lang.TXT_OVERWRITE_OLD_TILES }}</CheckBox
        >
      </FormLine>
      <FormLine class="offset-sm-0">
        <CheckBox
          @update="
            (value: boolean) => (
              (downloadConf.updateDifferent = value), emit('update', downloadConf)
            )
          "
          :disabled="!updateOldTiles"
          >{{ Lang.TXT_OVERWRITE_OLD_TILES_DIFFERENT }}</CheckBox
        >
      </FormLine>
      <FormLine class="offset-sm-0">
        <CheckBox
          @update="
            (value: boolean) => (
              (downloadConf.updateDateTiles = updateOldTilesTime = value),
              emit('update', downloadConf)
            )
          "
          :disabled="!updateOldTiles"
          >{{ Lang.TXT_OVERWRITE_TILES_BEFORE }}</CheckBox
        >
        <DataPicker
          class="mt-2"
          @update="
            (value: string) => ((downloadConf.dateTiles = value), emit('update', downloadConf))
          "
          :disabled="!updateOldTilesTime || !updateOldTiles"
        />
      </FormLine>
      <FormLine>
        <CheckBox
          @update="
            (value: boolean) => ((downloadConf.emptyTiles = value), emit('update', downloadConf))
          "
          >{{ Lang.TXT_SAVE_EMPTY_TILES }}</CheckBox
        >
      </FormLine>
      <FormLine>
        <CheckBox
          @update="
            (value: boolean) => (
              (downloadConf.checkEmptyTiles = updateEmptyTiles = value),
              emit('update', downloadConf)
            )
          "
          >{{ Lang.TXT_OVERVRITE_EMPTY_TILES }}</CheckBox
        >
      </FormLine>
      <FormLine class="offset-sm-0">
        <CheckBox
          @update="
            (value: boolean) => (
              (downloadConf.updateDateEmpty = updateEmptyTilesTime = value),
              emit('update', downloadConf)
            )
          "
          :disabled="!updateEmptyTiles"
          >{{ Lang.TXT_OVERWRITE_TILES_BEFORE }}</CheckBox
        >
        <DataPicker
          class="mt-2"
          @update="
            (value: string) => ((downloadConf.dateEmpty = value), emit('update', downloadConf))
          "
          :disabled="!updateEmptyTilesTime || !updateEmptyTiles"
        />
      </FormLine>
    </div>
    <div class="col-sm-2">
      <h5 class="font-size-14 ms-3">{{ Lang.TXT_ZOOM }}</h5>
      <CheckBox
        class="mb-1 ms-3"
        v-for="item in enabledZooms"
        :key="item"
        @update="
          (value: number) => ((downloadConf.zoom[item] = value), emit('update', downloadConf))
        "
      >
        {{ `Z${item < 10 ? '0' : ''}${item}` }}</CheckBox
      >
    </div>
  </div>
</template>
