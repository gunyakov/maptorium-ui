<template>
  <div class="q-pa-sm">
    <div class="text-subtitle2 q-px-sm q-pb-sm">{{ $t('menu.view.job_manager') }}</div>

    <q-list v-if="jobs.length > 0" bordered separator>
      <q-expansion-item
        v-for="item in jobs"
        :key="item.ID"
        dense
        expand-separator
        switch-toggle-side
      >
        <template #header>
          <q-item-section>
            <div class="text-body2 ellipsis">{{ item.mapID }}</div>
            <q-linear-progress
              class="q-mt-xs"
              rounded
              size="8px"
              :value="getStat(item.ID).progress / 100"
            />
            <div class="text-caption q-mt-xs">{{ getStat(item.ID).progress }}%</div>
          </q-item-section>

          <q-item-section side>
            <q-btn
              dense
              flat
              round
              :icon="item.running ? 'pause' : 'play_arrow'"
              @click.stop="void JobManagerAPI.Toggle(item.ID)"
            />
          </q-item-section>
        </template>

        <q-list dense>
          <q-item>
            <q-item-section>{{ $t('txt.job.size') }}</q-item-section>
            <q-item-section side>{{ getStat(item.ID).sizeFormated }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>{{ $t('txt.job.tiles') }}</q-item-section>
            <q-item-section side>
              {{ getStat(item.ID).processed }} / {{ getStat(item.ID).total }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>{{ $t('txt.job.ese') }}</q-item-section>
            <q-item-section side>
              {{ getStat(item.ID).empty }}/{{ getStat(item.ID).skip }}/{{ getStat(item.ID).error }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>{{ $t('txt.job.time') }}</q-item-section>
            <q-item-section side>{{ getStat(item.ID).timeFormated }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>{{ $t('txt.job.eta') }}</q-item-section>
            <q-item-section side>{{ getStat(item.ID).timeETA }}</q-item-section>
          </q-item>
        </q-list>

        <div class="row items-center q-gutter-xs q-pa-sm">
          <q-btn dense flat round icon="arrow_upward" @click="void JobManagerAPI.Up(item.ID)">
            <q-tooltip>{{ $t('txt.job.actions.up') }}</q-tooltip>
          </q-btn>
          <q-btn dense flat round icon="delete" @click="void JobManagerAPI.Delete(item.ID)">
            <q-tooltip>{{ $t('txt.job.actions.delete') }}</q-tooltip>
          </q-btn>
          <q-btn dense flat round icon="arrow_downward" @click="void JobManagerAPI.Down(item.ID)">
            <q-tooltip>{{ $t('txt.job.actions.down') }}</q-tooltip>
          </q-btn>
        </div>
      </q-expansion-item>
    </q-list>

    <div v-else class="text-caption text-grey q-px-sm q-pb-sm">
      {{ $t('txt.job.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import JobManagerAPI from 'src/API/JobManager';
import type { iJobStat } from 'src/interface';

const jobs = JobManagerAPI.jobs;
const stats = JobManagerAPI.stat;

const defaultStat: iJobStat = {
  download: 0,
  error: 0,
  empty: 0,
  size: 0,
  skip: 0,
  time: 0,
  total: 0,
  queue: 0,
  progress: 0,
  sizeFormated: '0kB',
  timeFormated: '0m 0s',
  timeETA: '0m 0s',
  processed: 0,
};

function getStat(jobID: string): iJobStat {
  return stats[jobID]?.value ?? defaultStat;
}

onMounted(() => {
  if (jobs.value.length === 0) {
    void JobManagerAPI.List();
  }
});
</script>
