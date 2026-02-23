import { ResponseType } from 'src/enum';
//--------------------------------------------------------------------------
//Axios
//--------------------------------------------------------------------------
import axios from 'axios';
//--------------------------------------------------------------------------
//Import stores and composables
//--------------------------------------------------------------------------
import { useSettingsStore } from 'src/stores/settings';
//--------------------------------------------------------------------------
//Import Alerts help class to rise quasar alers and notify.
//--------------------------------------------------------------------------
import Alerts from 'src/alerts';
//--------------------------------------------------------------------------
// Import the i18n instance you created with createI18n()
//--------------------------------------------------------------------------
import { t } from 'src/i18n';

const urlList = {
  'core.maps': '/core/maps',
  'core.mapStorage': '/core/map-storage',
  'core.default': '/core/default',
  'core.mode': '/core/mode',
  'fs.current': '/fs/current',
  'fs.list': '/fs/list',
  'fs.create': '/fs/create',
  'fs.rename': '/fs/rename',
  'job.start': '/job/start',
  'job.stop': '/job/stop',
  'job.list': '/job/list',
  'job.download': '/job/download',
  'job.generate': '/job/generate',
  'job.up': '/job/up',
  'job.delete': '/job/delete',
  'job.down': '/job/down',
  'gps.now': '/gps/now',
  'gps.start': '/gps/start',
  'gps.stop': '/gps/stop',
  'gps.startrecord': '/gps/startrecord',
  'gps.stoprecord': '/gps/stoprecord',
  'gps.sample': '/gps/sample',
  'gps.routelist': '/gps/routelist',
  'gps.routenew': '/gps/routenew',
  'gps.route': '/gps/route',
  'gps.list': '/gps/list',
  'cached.poi': '/map/cached/poi',
  'poi:full_list': '/poi',
};

type UrlKey = keyof typeof urlList;

function joinBaseWithPath(path: string): string {
  const settings = useSettingsStore();
  const baseUrl = settings.getBaseURL().replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function executeRequest<T = unknown>(
  url: string,
  data = {},
  method: string = 'get',
  alert: boolean = false,
): Promise<T | boolean> {
  return new Promise((resolve) => {
    function resetTimeout() {
      const msg = t('request.timeout');
      if (alert) Alerts.error(msg.replace('$', url));
      resolve(false);
    }
    const timeOut = setTimeout(resetTimeout, 10000);

    const axiosConfig = {
      method: method,
      url: url,
      timeout: 3000,
      responseType: 'json',
      decompress: false,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    //@ts-expect-error error in declaration only
    axios(axiosConfig)
      .then(function (response) {
        const data = response.data;
        clearTimeout(timeOut);
        switch (data.result) {
          case ResponseType.success:
            if (alert && data.message) Alerts.success(data.message);
            if (data.data) resolve(data.data as T);
            else resolve(true);
            break;
          case ResponseType.info:
            if (alert && data.message) Alerts.info(data.message);
            if (data.data) resolve(data.data as T);
            else resolve(true);
            break;
          case ResponseType.warning:
            if (alert && data.message) Alerts.warning(data.message);
            resolve(false);
            break;
          case ResponseType.error:
            if (alert && data.message) Alerts.error(data.message);
            resolve(false);
            break;
          default:
            if (response.status == 200) resolve(response.data as T);
            else resolve(false);
        }
      })
      .catch((error) => {
        if (alert) Alerts.error(error.message);
        resolve(false);
      });
  });
}

export default function request<T = unknown>(
  urlKey: UrlKey,
  data = {},
  method: string = 'get',
  alert: boolean = false,
): Promise<T | boolean> {
  const url = joinBaseWithPath(urlList[urlKey]);
  return executeRequest<T>(url, data, method, alert);
}

export function requestPath<T = unknown>(
  path: string,
  data = {},
  method: string = 'get',
  alert: boolean = false,
): Promise<T | boolean> {
  //const url = joinBaseWithPath(path);
  const url = path;
  return executeRequest<T>(url, data, method, alert);
}

export function requestByKeyPath<T = unknown>(
  urlKey: UrlKey,
  path: string,
  data = {},
  method: string = 'get',
  alert: boolean = false,
): Promise<T | boolean> {
  const basePath = urlList[urlKey];
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = joinBaseWithPath(`${basePath}${normalizedPath}`);
  return executeRequest<T>(url, data, method, alert);
}
