import request from "../helpers/ajax";
//@ts-ignore
import Modal from "modal-vanilla";
import { PoiInfo } from "../interfases";
import { categoryOPT } from "../helpers/categories";
import { fire } from "../helpers/callbacks";
import { EventType } from "../enum";
//-----------------------------------------------------------------------------------------------
//CONFIG
//-----------------------------------------------------------------------------------------------
import config from "../config";

type PoiInfoLess = Omit<PoiInfo, "type" | "visible" | "points">

let callbackFunction:CallableFunction = function() {}

let poiID = 0;

let windowEl = document.querySelector('#POIPropertiesModal');

let modalWindow = new Modal({
    el: windowEl
});

let formEl = document.querySelector("#POIPropertiesForm") as HTMLInputElement;
let selectEl = formEl?.querySelector("select[name=categoryID]") as HTMLInputElement;
let nameEl = formEl?.querySelector("input[name='name']") as HTMLInputElement;
let weightEl = formEl?.querySelector("input[name='weight']") as HTMLInputElement;

windowEl?.querySelector(".btn-close")?.addEventListener("click", function() {
    modalWindow.hide();
});

windowEl?.querySelector(".btn-secondary")?.addEventListener("click", function() {
    modalWindow.hide();
});

windowEl?.querySelector(".btn-primary")?.addEventListener("click", async function() {
    modalWindow.hide();
    if(poiID > 0) {
        let data:PoiInfoLess = {
            ID: poiID,
            name: nameEl?.value?.toString() || "Poi " + poiID,
            width: parseInt(weightEl?.value || "2"),
            categoryID: parseInt(selectEl?.value || "1"),
            color: "",
            fillColor: "",
            fillOpacity: 0.5
        }
        let fillColor = fillColorPickr.getColor();
        let opacity = Math.round(fillColor.a * 100) / 100;
        data.fillOpacity = opacity;
        fillColor = fillColor.toHEXA();
        fillColor = "#" + fillColor[0] + fillColor[1] + fillColor[2];
        data.fillColor = fillColor;
        let color = ColorPickr.getColor();
        color = color.toHEXA();
        color = "#" + color[0] + color[1] + color[2];
        data.color = color;
        let result:Array<PoiInfo> = await request("/poi/update", data, "post", true);
        if(result) {
            callbackFunction(poiID, data);
        }
    }
    poiID = 0;
});

//@ts-ignore
var fillColorPickr = Pickr.create({
    el: "#mpFillColor",
    theme: "classic",
    default: "#038edc",
    defaultRepresentation: 'RGBA',
    swatches: ["rgba(244, 67, 54, 1)", "rgba(233, 30, 99, 0.95)", "rgba(156, 39, 176, 0.9)", "rgba(103, 58, 183, 0.85)", "rgba(63, 81, 181, 0.8)", "rgba(33, 150, 243, 0.75)", "rgba(3, 169, 244, 0.7)", "rgba(0, 188, 212, 0.7)", "rgba(0, 150, 136, 0.75)", "rgba(76, 175, 80, 0.8)", "rgba(139, 195, 74, 0.85)", "rgba(205, 220, 57, 0.9)", "rgba(255, 235, 59, 0.95)", "rgba(255, 193, 7, 1)"],
    components: {
        preview: !0,
        opacity: !0,
        hue: !0,
        interaction: {
        hex: 0,
        rgba: !0,
        hsva: 0,
        input: !0,
        clear: 0,
        save: !0
        }
    }
});

fillColorPickr.on('save', () => {
    fillColorPickr.hide();
});
//@ts-ignore
var ColorPickr = Pickr.create({
    el: "#mpColor",
    theme: "classic",
    default: "#038edc",
    defaultRepresentation: 'RGBA',
    swatches: ["rgba(244, 67, 54, 1)", "rgba(233, 30, 99, 0.95)", "rgba(156, 39, 176, 0.9)", "rgba(103, 58, 183, 0.85)", "rgba(63, 81, 181, 0.8)", "rgba(33, 150, 243, 0.75)", "rgba(3, 169, 244, 0.7)", "rgba(0, 188, 212, 0.7)", "rgba(0, 150, 136, 0.75)", "rgba(76, 175, 80, 0.8)", "rgba(139, 195, 74, 0.85)", "rgba(205, 220, 57, 0.9)", "rgba(255, 235, 59, 0.95)", "rgba(255, 193, 7, 1)"],
    components: {
        preview: !0,
        opacity: !0,
        hue: !0,
        interaction: {
        hex: 0,
        rgba: !0,
        hsva: 0,
        input: !0,
        clear: 0,
        save: !0
        }
    }
});
ColorPickr.on('save', () => {
    ColorPickr.hide();
});

export async function POIPropertiesWindow(ID:number, callback:CallableFunction = function() {}) {
    //Save function to fire after save button
    callbackFunction = callback;

    if(ID > 0) {

      let data = await request(`/poi/info/${ID}`, {}, "get", true);

      let categoryList = await request("/poi/category", {}, "get");

      
      if(categoryList) {
        let html = categoryOPT(categoryList);
        //@ts-ignore
        selectEl?.innerHTML = html;
      }

      if(data) {
        //@ts-ignore
        const options = Array.from(selectEl?.options);
        //@ts-ignore
        options.find((item:HTMLOptionElement) => {
            if(parseInt(item.value) === data.categoryID) {
                item.selected = true;
            }
        });
    
        poiID = parseInt(data.ID);
        //@ts-ignore
        nameEl?.value = data.name;
        //@ts-ignore
        weightEl?.value = data.width;
        fillColorPickr.setColor(data.fillColor + Math.floor(data.fillOpacity * 255).toString(16), false);
        ColorPickr.setColor(data.color, false);
        modalWindow.show();
      }
    }
    else {
        poiID = 0;
    }
}

let addMarkBtn = document.getElementById("addMarkBtn") as HTMLButtonElement;
let addMarkForm = document.getElementById("addMarkForm") as HTMLFormElement;

addMarkBtn?.addEventListener("click", async() => {
    let formData = new FormData(addMarkForm);
    let data = {
        ID: 0,
        lat: formData.get("lat"),
        lng: formData.get("lng"),
        name: formData.get("name"),
        categoryID: formData.get("categoryID")
    }
    let result = await request("/poi/addMark", data, "post", true) as {ID: number};
    if(result.ID > 0) {
        data.ID = result.ID;
        fire(EventType.addPoint, data);

    }
    let markLatEl = document.querySelector("[name=lat]");
    markLatEl?.setAttribute("m-fix", "no");
});

let panelEl = document.getElementById(config.instrumentalPanelID) as HTMLElement;
let saveBtn = panelEl?.querySelector(config.instrumentalPanelSaveBtnSelector);
saveBtn?.addEventListener( 'click', () => {
    fire(EventType.savePoi);
})
let saveNewBtn = panelEl?.querySelector(config.instrumentalPanelSaveNewBtnSelector);
saveNewBtn?.addEventListener( "click", () => {
    fire(EventType.savePoiNew);
})