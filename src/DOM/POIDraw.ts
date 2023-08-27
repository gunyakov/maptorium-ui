
import config from "../config";

import {fire} from "../helpers/callbacks";
import { EventType, POIType } from "../enum";

let drawPolylineBtn = document.getElementById(config.startDrawPolylineBtnID);
let drawPolygoneBtn = document.getElementById(config.startDrawPolygonBtnID);
let drawSquareBtn = document.getElementById(config.startDrawSquareBtnID);
let drawerPanelEl = document.getElementById(config.drawerPanelID);
let saveBtn = drawerPanelEl?.querySelector(config.drawerPanelSaveBtnSelector);
let cancelBtn = drawerPanelEl?.querySelector(config.drawerPanelCancelBtnSelector);
let moveBtn = drawerPanelEl?.querySelector(config.drawerPanelMoveBtnSelector);

let panelEnableMove = false;

let drawType:POIType = POIType.point;

drawPolygoneBtn?.addEventListener("click", () => {
    fire(EventType.startPolygon);
    drawType = POIType.polygon;
    //@ts-ignore
    drawerPanelEl?.style.display = "block";
});

drawPolylineBtn?.addEventListener("click", () => {
    drawType = POIType.polyline;
    fire(EventType.startPolyline);
    //@ts-ignore
    drawerPanelEl?.style.display = "block";
});

drawSquareBtn?.addEventListener("click", () => {
    drawType = POIType.square;
    fire(EventType.startSquare);
    //@ts-ignore
    drawerPanelEl?.style.display = "block";
});

cancelBtn?.addEventListener("click", () => {
    if(drawType == POIType.polygon) {
        fire(EventType.stopPolygon);
    }
    if(drawType == POIType.polyline) {
        fire(EventType.stopPolyline);
    }
    if(drawType == POIType.square) {
        fire(EventType.stopSquare);
    }
    //@ts-ignore
    drawerPanelEl?.style.display = "none";
});

saveBtn?.addEventListener("click", () => {
    if(drawType == POIType.polygon) {
        fire(EventType.savePolygon);
    }
    if(drawType == POIType.polyline) {
        fire(EventType.savePolyline);
    }
    if(drawType == POIType.square) {
        fire(EventType.saveSquare);
    }
    //@ts-ignore
    drawerPanelEl?.style.display = "none";
});

//-----------------------------------------------------------------------------------------------
//INSTRUMENT PANELS MOVE BUTTONS
//-----------------------------------------------------------------------------------------------

moveBtn?.addEventListener( 'mousedown', (e) => {
    panelEnableMove = true;
});

moveBtn?.addEventListener( 'mouseup', () => {
    panelEnableMove = false;
});

document.body.addEventListener("mousemove", (e) => {
    if(panelEnableMove) {
        //@ts-ignore
        drawerPanelEl.style.left = (e.clientX - 20).toString() + "px";
        //@ts-ignore
        drawerPanelEl.style.top = (e.clientY - 20).toString() + "px";
    }
});

export function empty() {

}