import { ResponseType } from "../enum";
//------------------------------------------------------------------------------
//Axios
//------------------------------------------------------------------------------
let axios = require("axios");

import Alerts from "../alerts";

export default function request (url:string, data = {}, method:string = "post", alert:boolean = false):boolean | any {
    
    return new Promise((resolve, reject) => {
        function resetTimeout() {
            //Alerts.error(`Request ${url} was aborted due to timeout.`);
            Alerts.error(`Request ${url} was aborted due to timeout.`);
            resolve(false);
        }
        let timeOut = setTimeout(resetTimeout, 10000);

        //Generate axios config
        let axiosConfig = {
            method: method,
            url: url,
            timeout: 3000,
            responseType: "json",
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
        axios(axiosConfig).then(function (response) {
            let data = response.data;
            clearTimeout(timeOut);
            switch(data.result) {
                case ResponseType.success:
                    if(alert) {
                        Alerts.success(data.message);
                    }
                    resolve(data.data);
                    break;
                case ResponseType.info:
                    if(alert) {
                        Alerts.info(data.message);
                    }
                    resolve(data.data);
                    break;
                case ResponseType.warning:
                    if(alert) {
                        Alerts.warning(data.message);
                    }
                    resolve(false);
                    break;
                case ResponseType.error:
                    if(alert) {
                        Alerts.error(data.message);
                    }
                    resolve(false);
                    break;
                default: 
                    console.log("Results state is unspecified.");
                    resolve(false);
            }
            //@ts-ignore
      }).catch(async function (error) {
            if(alert) {
                Alerts.error(error.message);
            }
            resolve(false);
      });
    });
}