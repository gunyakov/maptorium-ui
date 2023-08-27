import jsonData from "../serverdata";
//@ts-ignore
import Modal from "modal-vanilla";
import { JobInfo } from "../interfases";


import Alerts from "../alerts";

import { refreshJobList } from "./JobManager";

let windowEl = document.getElementById('jobModal');

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
    let data = new FormData(windowEl?.querySelector("#jobForm") as HTMLFormElement);
    let jobConfig:JobInfo = {
        ID: "new",
        polygonID: 0,
        mapID: "none",
        randomDownload: true,
        updateTiles: false,
        updateDifferent: false,
        updateDateTiles: false,
        checkEmptyTiles: false,
        dateTiles: new Date(Date.now()).toISOString(),
        emptyTiles: false,
        updateDateEmpty: false,
        dateEmpty: new Date(Date.now()).toISOString(),
        zoom: [0]
    }

    for(const key in jobConfig) {
        switch (key) {
            case "zoom":
                let zoom = data.getAll(key) as unknown as Array<number>;
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
    if(await jsonData.jobAdd(jobConfig)) {
        modalWindow.hide();
        refreshJobList();
    }
});

let updateTilesCheck = windowEl?.querySelector("[name=updateTiles]") as HTMLInputElement;

updateTilesCheck?.addEventListener("click", () => {
    if(updateTilesCheck?.checked) {
        windowEl?.querySelector("[name=updateDifferent]")?.removeAttribute("disabled");
        windowEl?.querySelector("[name=updateDateTiles]")?.removeAttribute("disabled");
        windowEl?.querySelector("[name=dateTiles]")?.removeAttribute("disabled");
    }
    else {
        windowEl?.querySelector("[name=updateDifferent]")?.setAttribute("disabled", "");
        windowEl?.querySelector("[name=updateDateTiles]")?.setAttribute("disabled", "");
        windowEl?.querySelector("[name=dateTiles]")?.setAttribute("disabled", "");
    }
});

let checkEmptyTiles = windowEl?.querySelector("[name=checkEmptyTiles]") as HTMLInputElement;

checkEmptyTiles?.addEventListener("click", () => {
    if(checkEmptyTiles?.checked) {
        windowEl?.querySelector("[name=updateDateEmpty]")?.removeAttribute("disabled");
        windowEl?.querySelector("[name=dateEmpty]")?.removeAttribute("disabled");
    }
    else {
        windowEl?.querySelector("[name=updateDateEmpty]")?.setAttribute("disabled", "");
        windowEl?.querySelector("[name=dateEmpty]")?.setAttribute("disabled", "");
    }
});

export async function POIDownloadWindow(ID:number) {
    windowEl?.querySelector("#polygonID")?.setAttribute("value", ID.toString());
    modalWindow.show();
}

