import { ref } from 'vue';

const visible = ref(false);
const name = ref<string | null>(null);
const total = ref('');

export const useRouteHoverMeasure = () => {
  const set = (payload: { name: string; total: string }) => {
    name.value = payload.name;
    total.value = payload.total;
    visible.value = true;
  };

  const clear = () => {
    visible.value = false;
    name.value = null;
    total.value = '';
  };

  return {
    visible,
    name,
    total,
    set,
    clear,
  };
};

export type RouteHoverMeasureStore = ReturnType<typeof useRouteHoverMeasure>;
