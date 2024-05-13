import { ResponseType } from '../enum'
//------------------------------------------------------------------------------
//Axios
//------------------------------------------------------------------------------
import axios from 'axios'

import Alerts from '@/alerts'

import Lang from '@/lang/index'

export default function request(
  url: string,
  data = {},
  method: string = 'post',
  alert: boolean = false
): boolean | any {
  return new Promise((resolve, reject) => {
    function resetTimeout() {
      const msg = Lang.value.TXT_REQUEST_TIMEOUT
      if (alert) Alerts.error(msg.replace('$', url))
      resolve(false)
    }
    const timeOut = setTimeout(resetTimeout, 10000)

    //Generate axios config
    const axiosConfig = {
      method: method,
      url: url,
      timeout: 3000,
      responseType: 'json',
      decompress: false,
      //withCredentials: true,
      data: data,
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    }

    //Try to get urls
    //@ts-ignore
    axios(axiosConfig)
      .then(function (response) {
        const data = response.data
        clearTimeout(timeOut)
        switch (data.result) {
          case ResponseType.success:
            if (alert && data.message) {
              Alerts.success(data.message)
            }
            if (data.data) resolve(data.data)
            else resolve(true)
            break
          case ResponseType.info:
            if (alert && data.message) {
              Alerts.info(data.message)
            }
            if (data.data) resolve(data.data)
            else resolve(true)
            break
          case ResponseType.warning:
            if (alert && data.message) {
              Alerts.warning(data.message)
            }
            resolve(false)
            break
          case ResponseType.error:
            if (alert && data.message) {
              Alerts.error(data.message)
            }
            resolve(false)
            break
          default:
            if (response.status == 200) {
              resolve(response.data)
            } else {
              console.log('Results state is unspecified.')
              console.log(response)
              resolve(false)
            }
        }
        //@ts-ignore
      })
      .catch(async function (error) {
        if (alert) {
          Alerts.error(error.message)
        }
        resolve(false)
      })
  })
}
