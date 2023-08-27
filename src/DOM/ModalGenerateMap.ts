
import config from "../config";
import jsonData from "../serverdata";
import { refreshJobList } from "./JobManager";
import { GenJobInfo } from "../interfases";
//@ts-ignore
import Modal from "modal-vanilla";
import Alerts from "../alerts";

let windowEl = document.getElementById(config.genMapModal.ID);

let modalWindow = new Modal({
    el: windowEl
});

windowEl?.querySelector(".btn-close")?.addEventListener("click", () => {
    modalWindow.hide();
});

windowEl?.querySelector(".btn-secondary")?.addEventListener("click", () => {
    modalWindow.hide();
});

windowEl?.querySelector(".btn-primary")?.addEventListener("click", async () => {
    
    //Here code to get data from form and send to server
    let data = new FormData(windowEl?.querySelector("#jobFormGenerate") as HTMLFormElement);
    let jobConfig:GenJobInfo = {
        ID: "new",
        polygonID: 0,
        mapID: "none",
        zoom: ["0"],
        updateTiles: false,
        completeTiles: false,
        fromZoom: "0",
        previousZoom: false
    }

    for(const key in jobConfig) {
        switch (key) {
            case "zoom":
                let zoom = data.getAll(key) as unknown as Array<string>;
                if(zoom.length < 1) {
                    Alerts.warning("You must select minimum one zoom level.");
                    return;
                }
                else {
                    jobConfig.zoom = zoom;
                }
                break;
            case "polygonID": 
                let polygonID = data.get("polygonID") as unknown as number;
                if(!data.get("polygonID")) {
                    Alerts.warning("Polygon ID is empty.");
                    return;
                }
                else {
                    jobConfig.polygonID = polygonID; 
                }
                break;
            case "mapID":
                let mapID = data.get('mapID') as unknown as string;
                if(mapID == null || mapID.length < 2) {
                    Alerts.warning("You didnt select map from list.");
                    return;
                }
                else {
                    jobConfig.mapID = mapID;
                }
                break;
            default:
                if(data.get(key) == "true") {
                    //@ts-ignore
                    jobConfig[key] = true;
                }
                else if(data.get(key) != null) {
                    //@ts-ignore
                    jobConfig[key] = data.get(key);
                }
        }
    }
    for(let i = 0; i < jobConfig.zoom.length; i++) {
        let fromZoom = parseInt(jobConfig.fromZoom);
        let keyZoom = parseInt(jobConfig.zoom[i]);
        if(keyZoom >= fromZoom) {
            Alerts.warning("Generated zooms must be less than base zoom.");
            return;
        }
    }
    if(await jsonData.jobGenAdd(jobConfig)) {
        modalWindow.hide();
        refreshJobList();
    }
});

export async function GenerateMapWindow(ID:number) {
    windowEl?.querySelector("#polygonIDGenerate")?.setAttribute("value", ID.toString());
    modalWindow.show();
}