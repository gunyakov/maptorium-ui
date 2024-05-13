<script setup lang="ts">
import Animation from '@/components/elements/JobManager/Animation.vue'
import API from '@/API/index'
import Lang from '@/lang/index'
import StatLine from '@/components/elements/JobManager/StatLine.vue'
import BtnGroup from '@/components/elements/JobManager/BtnGroup.vue'
import Button from '@/components/elements/JobManager/Button.vue'
</script>
<template>
  <div class="job-manager" v-if="API.JobManager.show.value && API.JobManager.jobs.value.length > 0">
    <template v-for="(item, key) in API.JobManager.jobs.value" :key="key">
      <div class="accordion-item">
        <div class="accordion-header">
          <div class="d-flex p-2">
            <div class="flex-grow-1 overflow-hidden me-3">
              <div class="progress animated-progess mb-1">
                <div
                  class="progress-bar bg-primary"
                  role="progressbar"
                  :style="{ width: API.JobManager.stat[item.ID].value.progress + '%' }"
                  :aria-valuenow="API.JobManager.stat[item.ID].value.progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <p>
                {{ item.mapID }}
              </p>
              <Animation :run="item.running" />
            </div>
            <div class="flex-shrink-0 text-end">
              <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                <Button
                  @click="API.JobManager.Toggle(item.ID)"
                  :icon="item.running ? 'bx bx-pause' : 'bx bx-play'"
                ></Button>
                <Button
                  data-bs-toggle="collapse"
                  :data-bs-target="`#${item.ID}`"
                  icon="mdi mdi-chevron-down"
                ></Button>
              </div>
            </div>
          </div>
        </div>
        <div :id="item.ID" class="accordion-collapse collapse" :aria-labelledby="item.ID">
          <div class="accordion-body ml-2">
            <StatLine>
              {{ Lang.TXT_SIZE }}:
              <template #body>{{ API.JobManager.stat[item.ID].value.sizeFormated }}</template>
            </StatLine>
            <StatLine>
              {{ Lang.TXT_TILES }}:
              <template #body
                >{{ API.JobManager.stat[item.ID].value.processed }} from
                {{ API.JobManager.stat[item.ID].value.total }} ({{
                  API.JobManager.stat[item.ID].value.progress
                }}%)</template
              >
            </StatLine>
            <StatLine>
              {{ Lang.TXT_ESE }}
              <i
                class="font-size-16 align-middle bx bxs-help-circle"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="Lang.TXT_ESE_DESCR"
                :data-bs-original-title="Lang.TXT_ESE_DESCR"
              ></i
              >:
              <template #body>
                {{
                  ` ${API.JobManager.stat[item.ID].value.empty}/${API.JobManager.stat[item.ID].value.skip}/${API.JobManager.stat[item.ID].value.error}`
                }}
              </template>
            </StatLine>
            <StatLine>
              {{ Lang.TXT_TIME }}:
              <template #body>{{ API.JobManager.stat[item.ID].value.timeFormated }}</template>
            </StatLine>
            <StatLine>
              {{ Lang.TXT_ETA }}:
              <template #body>{{ API.JobManager.stat[item.ID].value.timeETA }}</template>
            </StatLine>
            <BtnGroup>
              <Button @click="API.JobManager.Up(item.ID)" icon="bx bx-sort-up">{{
                Lang.BTN_UP
              }}</Button>
              <Button @click="API.JobManager.Delete(item.ID)" icon="bx bxs-eraser">{{
                Lang.BTN_DELETE
              }}</Button>
              <Button @click="API.JobManager.Down(item.ID)" icon="bx bx-sort-down">{{
                Lang.BTN_DOWN
              }}</Button>
            </BtnGroup>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<style>
.job-manager {
  width: 300px;
  position: absolute;
  top: 18px;
  right: 18px;
  background-color: rgba(7, 23, 57, 0.7);
  color: #c8d4f0;
  backdrop-filter: blur(3px);
}

.job-manager p {
  margin-bottom: 0px;
  font-size: small;
}

.dark-theme .job-manager {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
}

.light-theme .job-manager {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
}
</style>
