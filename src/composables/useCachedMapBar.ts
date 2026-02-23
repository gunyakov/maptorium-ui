import { computed, ref } from 'vue';

export type CachedMapProgress = { tiles: number; total: number };

const tiles = ref(0);
const total = ref(0);
const show = ref(false);

const progressRatio = computed(() => {
  if (total.value <= 0) return 0;
  const ratio = tiles.value / total.value;
  if (!Number.isFinite(ratio)) return 0;
  return Math.min(1, Math.max(0, ratio));
});

const percentage = computed(() => Math.round(progressRatio.value * 100));

function updateProgress(tilesCount: number, totalCount: number) {
  tiles.value = Math.max(0, tilesCount);
  total.value = Math.max(0, totalCount);

  if (total.value <= 0) {
    show.value = false;
    return;
  }

  show.value = tiles.value < total.value;
}

function hide() {
  show.value = false;
}

function reset() {
  tiles.value = 0;
  total.value = 0;
  show.value = false;
}

export function useCachedMapBar() {
  return {
    tiles,
    total,
    show,
    progressRatio,
    percentage,
    updateProgress,
    hide,
    reset,
  };
}

export function setCachedMapBarProgress(progress: CachedMapProgress) {
  updateProgress(progress.tiles, progress.total);
}

export function hideCachedMapBar() {
  hide();
}
