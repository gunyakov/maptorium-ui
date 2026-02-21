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
                  'bg-primary': GPS.run.value,
                  'text-white': GPS.run.value,
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
                  'bg-primary': GPS.record.value,
                  'text-white': GPS.record.value,
                }"
              >
                <q-item-section>{{ $t('menu.gps.route.record') }}</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="Routes.show()"
                :class="{
                  'bg-primary': Routes.onMap.value,
                  'text-white': Routes.onMap.value,
                }"
              >
                <q-item-section>{{ $t('menu.gps.route.show') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="Routes.toggle()">
                <q-item-section>{{ $t('menu.gps.route.new') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="GPS.SampleTime()">
                <q-item-section>{{ $t('menu.gps.route.sample_time') }}...</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="GPS.distanceToGoModal()">
                <q-item-section>{{ $t('menu.gps.route.distance_go') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
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
              <q-item clickable v-close-popup>
                <q-item-section>{{ $t('menu.gps.history.clean') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                v-for="(item, index) in Routes.routes.value"
                :key="index"
                @click="Routes.points(item.ID)"
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
          @click="GPS.center.value = !GPS.center.value"
          :class="{ 'bg-primary': GPS.center.value, 'text-white': GPS.center.value }"
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
import GPS from 'src/API/GPS';
import Routes from 'src/API/Routes';
</script>
