<template>
  <div class="q-ml-md cursor-pointer non-selectable">
    {{ $t('menu.gps.root') }}
    <q-menu>
      <q-list dense style="min-width: 100px">
        <q-item clickable>
          <q-item-section side>
            <q-icon name="mdi-satellite-variant" />
          </q-item-section>
          <q-item-section>{{ $t('menu.gps.service') }}</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list dense>
              <q-item
                clickable
                v-close-popup
                @click="GPS.toggle()"
                :class="{
                  'bg-primary': gps.run.value,
                  'text-white': gps.run.value,
                }"
              >
                <q-item-section>{{ $t('menu.gps.start') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="GPS.GPSConfigModal()">
                <q-item-section>{{ $t('menu.gps.options') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <q-item clickable>
          <q-item-section side>
            <q-icon name="mdi-go-kart-track" />
          </q-item-section>
          <q-item-section>{{ $t('menu.gps.route.menu') }}</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list dense>
              <q-item
                clickable
                v-close-popup
                @click="GPS.toggleRecord()"
                :class="{
                  'bg-primary': gps.record.value,
                  'text-white': gps.record.value,
                }"
              >
                <q-item-section>{{ $t('menu.gps.route.record') }}</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="Routes.toggle()"
                :class="{
                  'bg-primary': Routes.onMap.value,
                  'text-white': Routes.onMap.value,
                }"
              >
                <q-item-section>{{ $t('menu.gps.route.show') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="GPS.New()">
                <q-item-section>{{ $t('menu.gps.route.new') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="GPS.SampleTime()">
                <q-item-section>{{ $t('menu.gps.route.sample_time') }}...</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="GPS.distanceToGoModal()">
                <q-item-section>{{ $t('menu.gps.route.distance_go') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="GPS.routeFromFileModal()">
                <q-item-section>{{ $t('menu.gps.route.from_file') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <q-item clickable>
          <q-item-section side>
            <q-icon name="mdi-history" />
          </q-item-section>
          <q-item-section>{{ $t('menu.gps.history.menu') }}</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list dense>
              <q-item clickable v-close-popup @click="routeHistory.clearRoutes()">
                <q-item-section>{{ $t('menu.gps.history.clean') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                v-for="(item, index) in Routes.routes.value"
                :key="index"
                @click="Routes.Points(item.ID)"
                :class="{
                  'bg-primary': routeHistory.isVisible(item.ID),
                  'text-white': routeHistory.isVisible(item.ID),
                }"
              >
                <q-item-section>{{ item.name }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section side>
            <q-icon name="mdi-satellite-uplink" />
          </q-item-section>
          <q-item-section>{{ $t('menu.gps.follow') }}</q-item-section>
        </q-item>
        <q-item
          clickable
          @click="gps.center.value = !gps.center.value"
          :class="{ 'bg-primary': gps.center.value, 'text-white': gps.center.value }"
        >
          <q-item-section side>
            <q-icon name="mdi-axis-arrow-lock" />
          </q-item-section>
          <q-item-section>{{ $t('menu.gps.center') }}</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section side>
            <q-icon name="mdi-pin" />
          </q-item-section>
          <q-item-section>{{ $t('menu.gps.add_marker') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import { useGPS } from 'src/composables/useGPS';
import GPS from 'src/API/GPS';
import Routes from 'src/API/Routes';
import { useRouteHistoryStore } from 'src/stores/routeHistory';
const gps = useGPS();
const routeHistory = useRouteHistoryStore();
</script>
