import request from "../helpers/ajax";
//@ts-ignore
import Modal from "modal-vanilla";
import { PoiInfo } from "../interfases";

//------------------------------------------------------------------------
//INSTRUMENTAL PANEL
//------------------------------------------------------------------------

let panelEl = document.querySelector("#intrumentalPanel") as HTMLElement;
let saveBtn = panelEl?.querySelector("[m-action=save]");
let saveNewBtn = panelEl?.querySelector("[m-action=save-new]");


saveBtn?.addEventListener( "click", () => {
    panelEl.style.display = "none";
});

saveNewBtn?.addEventListener( "click", () => {
    panelEl.style.display = "none";
});

export function POIEditWindow() {
    panelEl.style.display = "block";
}


