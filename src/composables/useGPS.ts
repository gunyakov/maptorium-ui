//--------------------------------------------------------------------------
//Import vue
//--------------------------------------------------------------------------
import request from 'src/API/ajax';
import { GPSType } from 'src/enum';
import type { SelectItem, USBDevice } from 'src/interface';
import type { Ref } from 'vue';
import { ref, watch } from 'vue';
//--------------------------------------------------------------------------
//Composable for managing GPS configuration
//--------------------------------------------------------------------------
const options = Object.values(GPSType);
const USBDevList: Ref<Array<SelectItem>> = ref([]);
const usbLoading = ref(false);
const data: Ref<{ type: GPSType; host: string; port: number; device: string }> = ref({
  type: GPSType.tcp,
  host: '127.0.0.1',
  port: 9010,
  device: 'COM1',
});
const run: Ref<boolean> = ref(false);
const record: Ref<boolean> = ref(false);
const center: Ref<boolean> = ref(false);
export const useGPS = () => {
  const makeUSBDevList = async () => {
    usbLoading.value = true;
    try {
      const rawUSBList = (await request('gps.list', {}, 'get')) as Array<USBDevice> | false;
      USBDevList.value = [];
      if (rawUSBList) {
        rawUSBList.forEach((valueL) => {
          if (valueL.path) {
            USBDevList.value.push({
              title: valueL.friendlyName || valueL.manufacturer || valueL.path,
              value: valueL.path,
            });
          }
        });
        data.value.device = rawUSBList[0]?.path || '';
      }
    } catch (e) {
      console.error((e as Error)?.message);
    } finally {
      usbLoading.value = false;
    }
  };

  watch(
    () => data.value.type,
    async (newType: GPSType) => {
      if (newType === GPSType.usb) {
        await makeUSBDevList();
      }
    },
    { deep: true, immediate: true },
  );
  return {
    makeUSBDevList,
    USBDevList,
    usbLoading,
    data,
    options,
    run,
    record,
    center,
  };
};
//-------------------------------------------------------------------------
// Export the type of the store instance
//-------------------------------------------------------------------------
export type GPS = ReturnType<typeof useGPS>;
