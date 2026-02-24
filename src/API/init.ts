import type { DefaultConfig } from 'src/interface';
import request from './ajax';
import { useNetworkMode } from 'src/composables/useNetworkMode';
import { useGPS } from 'src/composables/useGPS';
import { DownloadMode, GPSType } from 'src/enum';

export default async function init() {
  // Placeholder for any initialization logic needed for the API module
  // For example, you could set up default headers, base URL, or perform a test request to ensure connectivity
  const data = await request<DefaultConfig>('core.default');

  if (data && typeof data === 'object') {
    const networkMode = useNetworkMode();
    networkMode.mode.value = data.mode || DownloadMode.enable;
    const gps = useGPS();
    gps.data.value.host = data.gpsServer?.host || '127.0.0.1';
    gps.data.value.port = data.gpsServer?.port || 9010;
    gps.data.value.type = data.gpsServer?.type || GPSType.tcp;
    gps.data.value.device = data.gpsServer?.device || 'COM1';
    gps.run.value = data.gpsServiceRun || false;
    gps.record.value = data.recordRoute || false;
  }
}
