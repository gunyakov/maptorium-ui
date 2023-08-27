import Alerts from "../alerts";
import { EventType } from "../enum";
import { fire } from "../helpers/callbacks";
import jsonData from "../serverdata";
//@ts-ignore
import Modal from "modal-vanilla";

let modalElW:Modal | null = null;

class CachedMap {

    private _el:HTMLElement | null = null;
    private _cancelBtnEl:HTMLElement | null = null;
    private _infoTxtEl:HTMLElement | null = null;
    private _prgBarEl:HTMLElement | null = null;
    private _modal:Modal | null = null;
    private _mapID:string = "";
    private _zoom:number = 0;
    private _zoomOffset:number = 0;
    private _mapCurZoom:number = 0;
    private _poiID:number = 0;

    private _bbox:Array<number> = [];

    private _options = {
        btnCachedMapZoomID: "cachedMapZoom",
        btnCachedMapOffsetID: "cachedMapOffset",
        btnCachedMapClean: "cachedMapClean",
        bar: {
            ID: "cachedMapBar",
        cancelBtnEl: "[m-data=btn-cancel]",
        infoTxtEl: "[m-data=descr]",
        prgBarEl: ".progress-bar"
        },
        modal: {
            ID: "cachedMapModal",
            btnCloseEl: ".btn-close",
            btnCancelEl: ".btn-secondary",
            btnZoomEl: "[m-action=set-zoom]",
            btnZoomOffsetEl: "[m-action=set-offset]",
            mapIDEl: "mapsListCachedMap"
        }
        
    }

    constructor() {
        let thisClass = this;
        this._el = document.getElementById(this._options.bar.ID);
        if(this._el) {
            this._cancelBtnEl = this._el.querySelector(this._options.bar.cancelBtnEl);
            this._cancelBtnEl?.addEventListener("click", async () => {
                if(await jsonData.cancelCachedMapBuild()) {                  
                    thisClass.hideCachedBar();
                }
            });
            this._infoTxtEl = this._el.querySelector(this._options.bar.infoTxtEl);
            this._prgBarEl = this._el.querySelector(this._options.bar.prgBarEl); 
        }
        else {
            console.log('Cant find cached map progress element. UI will be limited.');
        }

        let modalEl = document.getElementById(this._options.modal.ID);
        if(modalEl) {
            modalEl.querySelector(this._options.modal.btnCloseEl)?.addEventListener("click", thisClass.hide);
            modalEl.querySelector(this._options.modal.btnCancelEl)?.addEventListener("click", thisClass.hide);
            this._modal = modalElW = new Modal({
                el: modalEl 
            });
            modalEl.querySelectorAll(this._options.modal.btnZoomEl).forEach((element) => {
                element.addEventListener("click", () => {      
                    thisClass._zoom = parseInt(element.getAttribute("m-data") || "0");
                    thisClass._zoomOffset = 0;
                    thisClass._getMapID();
                });
            });
            modalEl.querySelectorAll(this._options.modal.btnZoomOffsetEl).forEach((element) => {
                element.addEventListener("click", () => {
                    thisClass._zoomOffset = parseInt(element.getAttribute("m-data") || "0");
                    thisClass._zoom = 0;
                    thisClass._getMapID();
                });
            });
        }
        else console.log("Cant find Cached Map Modal window. UI will be limited.");

        let cleanBtn = document.getElementById(this._options.btnCachedMapClean);
        if(cleanBtn) cleanBtn.addEventListener("click", async() => {
            await jsonData.cleanCachedMap();
            thisClass._zoom = 0;
            thisClass._zoomOffset = 0;
            thisClass._mapID = "";
            fire(EventType.cachedTileMapClean);
        });
        else console.log("Cant find Cached Map Clean Button. UI will be limited.");
        
        let zoomBtn = document.getElementById(this._options.btnCachedMapZoomID);
        if(zoomBtn) zoomBtn.addEventListener("click", () => {
            thisClass.show();
            thisClass._poiID = 0;
        });
        else console.log("Cant find Cached Map Zoom set Button. UI will be limited.");

        let offsetBtn = document.getElementById(this._options.btnCachedMapOffsetID);
        if(offsetBtn) offsetBtn.addEventListener("click", () => {
            thisClass.show();
            thisClass._poiID = 0;
        });
        else console.log("Cant find Cached Map Zoom Offset button. UI will be limieted.");
    }
    public show(poiID:number = 0):void {
        if(poiID > 0) {
            this._poiID = poiID;
        }
        //if(this._modal) this._modal.show();
        if(modalElW) modalElW.show();
    }

    public hide():void {
        //console.log("Call hide cached map modal", this._modal);
        if(modalElW) modalElW.hide();
        //if(this._modal) this._modal.hide();
    }
    public showCachedBar() {
        if(this._el) this._el.style.display = "block";
    }
    
    public hideCachedBar() {
        if(this._el) this._el.style.display = "none";
    }
    
    public setCachedBar(tiles: number, total: number) {
        if(tiles == total) {
            this.hideCachedBar();
        }
        else {
            this.showCachedBar();
            let progress = Math.floor(tiles / total * 100);
            if(this._infoTxtEl) this._infoTxtEl.innerHTML = `Checked ${tiles} from ${total}.`;
            if(this._prgBarEl) this._prgBarEl.style.width = `${progress}%`;
        }
    }

    public setZoom(zoom:number = this._mapCurZoom) {

        if((this._zoom > 0 || this._zoomOffset > 0) && this._mapID.length > 0) {
            if(this._poiID == 0) {
                if(this._zoom > 0) jsonData.getCachedMapBBOX(this._bbox, this._zoom, this._mapID);
                if(this._zoomOffset > 0) jsonData.getCachedMapBBOX(this._bbox, this._zoomOffset + this._mapCurZoom, this._mapID);
            }
            else {
                //Request new cached map for polygon only if zomm changed and its zoom offset
                //If zomm changed and its hard zoom set, no need update
                if(this._mapCurZoom != zoom && this._zoomOffset > 0) this.byPOI();
            }
        }
        this._mapCurZoom = zoom;
    }

    public setBBOX(bbox:Array<number> = this._bbox, zoom:number = this._mapCurZoom) {
        
        if(bbox.length >= 3) {
            this._bbox = bbox;
        }
        else console.log("BBOX must have minimum 3 point in list.");
        
    }

    public byPOI(poiID:number = this._poiID) {
        if(this._zoom > 0) jsonData.getCachedMapPOI(poiID, this._zoom, this._mapID);
        if(this._zoomOffset > 0) jsonData.getCachedMapPOI(poiID, this._zoomOffset + this._mapCurZoom, this._mapID);
    }

    private _getMapID() {
        console.log("Get map ID");
        let modalEl = document.getElementById(this._options.modal.ID);
        let mapIDEl = modalEl?.querySelector(`#${this._options.modal.mapIDEl}`) as HTMLSelectElement;
        if(mapIDEl && mapIDEl.value.length > 0) {
            this.hide();
            this._mapID = mapIDEl.value; 

            if(this._poiID > 0) this.byPOI();
            else this.setZoom();

            return true;
        }
        else {
            Alerts.warning("You didnt select map. Pls select map.");
            return false;
        }
    }
}

export default new CachedMap();

