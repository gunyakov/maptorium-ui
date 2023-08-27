//-----------------------------------------------------------------------------------------------
//CALLBACKS
//-----------------------------------------------------------------------------------------------
import { POIEditWindow } from "./DOM/POIEdit";
import { POIDownloadWindow } from "./DOM/ModalMapDownload";
import { GenerateMapWindow } from "./DOM/ModalGenerateMap";

import jsonData from "./serverdata";
import config from "./config";
 
let _recordRoute:boolean = false;

let gpsRouteRecordButton = document.getElementById(config.gpsRouteRecordButton);
if(gpsRouteRecordButton) {
    gpsRouteRecordButton.addEventListener("mouseup", (ev:MouseEvent) => {
        if(_recordRoute) {
            //@ts-ignore
            gpsRouteRecordButton.className = "";
            _recordRoute = false;
            jsonData.stopRecord();
        }
        else {
            //@ts-ignore
            gpsRouteRecordButton.className = config.toggleClass;
            _recordRoute = true;
            jsonData.startRecord();
        } 
    });
}


export default {
    //-------------------------------------------------------------------------------
    //Enable POI editing and popup instrumental panel
    //-------------------------------------------------------------------------------
    POIEdit: async function():Promise<void> {
        POIEditWindow();
    },
    //-------------------------------------------------------------------------------
    //Download tiles by POI
    //-------------------------------------------------------------------------------
    POIDownload: async function (ID:number):Promise<void> {
        POIDownloadWindow(ID);
    },

    GenerateMapModal: async function (ID:number):Promise<void> {
        GenerateMapWindow(ID);
    },

    setButton: async function(key:string) {
        //@ts-ignore
        let btn = document.getElementById(config[key]);
        if(btn) btn.className = config.menuSelectedClass;
        if(key == "gpsRouteRecordButton") _recordRoute = true;
    },

    
}