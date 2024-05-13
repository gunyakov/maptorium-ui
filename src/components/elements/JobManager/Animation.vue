<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import Lang from '@/lang/index'
const props = defineProps<{
  run?: boolean
}>()

let timer = setTimeout(() => {}, 1000)
let text = ref('')
function animation() {
  clearInterval(timer)
  if (props.run == true) {
    let a = 36
    timer = setInterval(() => {
      a++
      text.value += '.'
      if (a > 35) {
        a = 0
        text.value = Lang.value.TXT_RUNNING
      }
    }, 100)
  } else {
    text.value = Lang.value.TXT_PAUSED
  }
}
onMounted(animation)
watch(() => props.run, animation)
</script>
<template>
  <p>{{ text }}</p>
</template>
