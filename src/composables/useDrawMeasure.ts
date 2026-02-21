import { ref } from 'vue';

export interface DrawMeasureSegment {
  label: string;
  value: string;
}

export interface DrawMeasureArea {
  label: string;
  value: string;
}

const visible = ref(false);
const name = ref<string | null>(null);
const segments = ref<DrawMeasureSegment[]>([]);
const total = ref('');
const area = ref<string | null>(null);
const areas = ref<DrawMeasureArea[]>([]);

export const useDrawMeasure = () => {
  const set = (payload: {
    name?: string | null;
    segments: DrawMeasureSegment[];
    total: string;
    area?: string | null;
    areas?: DrawMeasureArea[];
  }) => {
    name.value = payload.name ?? null;
    segments.value = payload.segments;
    total.value = payload.total;
    area.value = payload.area ?? null;
    areas.value = payload.areas ?? [];
    visible.value = true;
  };

  const clear = () => {
    visible.value = false;
    name.value = null;
    segments.value = [];
    total.value = '';
    area.value = null;
    areas.value = [];
  };

  return {
    visible,
    name,
    segments,
    total,
    area,
    areas,
    set,
    clear,
  };
};

export type DrawMeasureStore = ReturnType<typeof useDrawMeasure>;
