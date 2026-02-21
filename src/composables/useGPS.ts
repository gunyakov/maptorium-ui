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
let USBDevList: Array<SelectItem> = [];
const data: Ref<{ type: GPSType; host: string; port: number; device: string }> = ref({
  type: GPSType.tcp,
  host: '127.0.0.1',
  port: 9010,
  device: 'COM1',
});
export const useGPS = () => {
  watch(
    () => data.value.type,
    (newType: GPSType) => {
      if (newType === GPSType.usb) {
        makeUSBDevList().catch((e) => console.error(e?.message));
      }
    },
    { deep: true },
  );
  const makeUSBDevList = async () => {
    const rawUSBList = (await request('gps.list', {}, 'get')) as Array<USBDevice> | false;
    if (rawUSBList) {
      USBDevList = [];
      rawUSBList.forEach((valueL) => {
        if (valueL.manufacturer && valueL.path)
          USBDevList.push({
            title: valueL.friendlyName || valueL.manufacturer,
            value: valueL.path,
          });
      });
    }
  };
  return {
    makeUSBDevList,
    USBDevList,
    data,
    options,
  };
};
//-------------------------------------------------------------------------
// Export the type of the store instance
//-------------------------------------------------------------------------
export type GPS = ReturnType<typeof useGPS>;
