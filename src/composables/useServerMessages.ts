//-------------------------------------------------------------------------
// Import vue functions
//-------------------------------------------------------------------------
import { ref, type Ref } from 'vue';
import { useSettingsStore } from 'src/stores/settings';
const settings = useSettingsStore();
//-------------------------------------------------------------------------
// var to keep server messages inside
//-------------------------------------------------------------------------
const logs: Ref<
  Array<{ module: string; type: string; message: string; time: number; formatedTime: string }>
> = ref([]);
//-------------------------------------------------------------------------
// Export the type of the messages store instance
//-------------------------------------------------------------------------
export const useServerMessages = () => {
  const clean = () => {
    logs.value = [];
  };
  return { logs: logs, clean };
};
//-------------------------------------------------------------------------
// Export the type of the messages store instance
//-------------------------------------------------------------------------
export type ServerMessages = ReturnType<typeof useServerMessages>;
//-------------------------------------------------------------------------
// Impoort socket instance
//-------------------------------------------------------------------------
import socket from 'src/API/Socket';
//-------------------------------------------------------------------------
// Connect socket event for getting messages from server
//-------------------------------------------------------------------------
socket.on(
  'message',
  (data: { module: string; type: string; message: string; time: number; formatedTime: string }) => {
    const date = new Date();
    data.formatedTime =
      date.getDay() +
      ' ' +
      date.toLocaleString('en-US', { month: 'long' }) +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes();
    logs.value.push(data);
    if (logs.value.length > settings.logsLength) logs.value.shift();
  },
);
