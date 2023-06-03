import { setOptions } from "./helpers/setoptions";
import { MapList, RouteList, ServerStat } from "./interfases";
import { EventType } from "./enum";
import { arrayRemove } from "./helpers/array";
import { formatBytes } from "./helpers/formatBytes";
 
export default class MDOM {

    private _callbacks:Array<CallableFunction> = [];                   //Calback array
    private _selectedMap:string = "";
    private _selectedLayers:Array<string> = [];
    private _showRoute:boolean = false;
    private _recordRoute:boolean = false;

    private options = {
        init: true,
        mapsContainerID: "map-list",
        layersContainerID: "layer-list",
        menuParrentTag: "li",
        menuChildTag: "a",
        menuParrentClass: "",
        menuChildClass: "",
        subMenuTag: "ul",
        subMenuClass: "sub-menu",
        menuSelectedClass: "bg-secondary",
        gpsRouteShowButton: "gps-show-route",
        gpsRouteRecordButton: "gps-record-route",
        gpsRouteNewButton: "gps-new-route",
        gpsRouteTimeButton: "gps-sample-time",
        gpsHistoryButton: "gps-history-list",
        gpsHistoryCleanButton: "gps-clear-history",
        toggleClass: "bg-secondary",
        mapContainerID: "mapMenuContainer",
        routeListContainer: '',

    }

    constructor(options:object = {}) {
        //Merge options with default options
        setOptions(this, options);

        if(this.options.init) {

            let MDOM = this;

            let gpsHistoryCleanButton = document.getElementById(this.options.gpsHistoryCleanButton);
            if(gpsHistoryCleanButton) {
                gpsHistoryCleanButton.addEventListener("click", (ev:MouseEvent) => {
                    MDOM._fire(EventType.historyHide);
                });
            }
            let gpsHistoryButton = document.getElementById(this.options.gpsHistoryButton);
            if(gpsHistoryButton) {
                gpsHistoryButton.addEventListener("click", (ev:MouseEvent) => {
                    //let points = this._jsonData.
                    //MDOM._fire(EventType.historyShow, points);
                });
            }
            let gpsRouteShowButton = document.getElementById(this.options.gpsRouteShowButton);
            if(gpsRouteShowButton) {
                gpsRouteShowButton.addEventListener("mouseup", (ev:MouseEvent) => {
                    if(MDOM._showRoute) {
                        //@ts-ignore
                        gpsRouteShowButton.className = "";
                        MDOM._fire(EventType.routeHide);
                    }
                    else {
                        //@ts-ignore
                        gpsRouteShowButton.className = MDOM.options.toggleClass;
                        MDOM._fire(EventType.routeShow);
                    }
                    MDOM._showRoute = !MDOM._showRoute;   
                });
            }
            let gpsRouteRecordButton = document.getElementById(this.options.gpsRouteRecordButton);
            if(gpsRouteRecordButton) {
                gpsRouteRecordButton.addEventListener("mouseup", (ev:MouseEvent) => {
                    if(MDOM._recordRoute) {
                        //@ts-ignore
                        gpsRouteRecordButton.className = "";
                        MDOM._fire(EventType.routeStopRecord);
                    }
                    else {
                        //@ts-ignore
                        gpsRouteRecordButton.className = MDOM.options.toggleClass;
                        MDOM._fire(EventType.routeStartRecord);
                    }
                    MDOM._recordRoute = !MDOM._recordRoute;   
                });
            }
        }
        
    }

    public makeMenu(mapList:Array<MapList>, bmapMenu:boolean = true) {
        let MDOM = this;

        let containerElement:HTMLElement | null;
        if(bmapMenu) {
            containerElement = document.getElementById(this.options.mapsContainerID);
        }
        else {
            containerElement = document.getElementById(this.options.layersContainerID);
        }

        let arrMenuMap:Array<HTMLElement> = [];
        for(let i = 0; i < mapList.length; i++) {
            //Get info about map
            let mapInfo = mapList[i];
            //Create menu link
            let li = document.createElement("li");
            li.className = MDOM.options.menuParrentClass;
            let a = document.createElement("a");
            a.setAttribute("map-id", mapInfo.id);
            a.setAttribute("id", "map-" + mapInfo.id);
            //@ts-ignore
            a.setAttribute("layer", bmapMenu ? "map" : "layer");
            
            a.className = MDOM.options.menuChildClass;
            //@ts-ignore
            a.text = mapInfo.name;
            
            a.addEventListener("click", function(ev:MouseEvent) {
                ev.preventDefault();
                ev.stopPropagation();
                let mapID = "";
                let layer = "";
                for(let i = 0; i < this.attributes.length; i++) {
                    if (this.attributes[i].name == "map-id") {
                        mapID = this.attributes[i].value;
                    }
                    if (this.attributes[i].name == "layer") {
                        layer = this.attributes[i].value;
                    }
                }
                if( mapID ) {
                    if(layer == "map") {
                        if(MDOM._selectedMap != mapID) {
                            MDOM._fire(EventType.mapChangeMap, mapID);
                            this.className = MDOM.options.menuSelectedClass;
                            let btn = document.getElementById("map-" + MDOM._selectedMap);
                            if(btn) btn.className = '';
                            MDOM._selectedMap = mapID;
                        }
                    }
                    else {
                        //Check if we have layer added to map
                        const index = MDOM._selectedLayers.indexOf(mapID);

                        let btn = document.getElementById("map-" + mapID);

                        if(index == -1) {
                            MDOM._fire(EventType.mapAddLayer, mapID);
                            if(btn) btn.className = MDOM.options.menuSelectedClass;
                            MDOM._selectedLayers.push(mapID);
                        }
                        else {
                            MDOM._fire(EventType.mapRemoveLayer, mapID);
                            if(btn) btn.className = "";
                            MDOM._selectedLayers = arrayRemove(MDOM._selectedLayers, mapID);
                            
                        }
                    }  
                }
            });

            li.appendChild(a);

            if(mapInfo.submenu) {
                let ul:HTMLElement;
                //If have no submenu to insert map
                //@ts-ignore
                if(typeof arrMenuMap[mapInfo.submenu] == "undefined") {
                    //Init new submenu container (li)
                    let subMenuElement = document.createElement("li");
                    //Create submenu link (a)
                    let aSub = document.createElement("a");
                    //Set submenu text
                    //@ts-ignore
                    aSub.text = mapInfo.submenu;
                    aSub.setAttribute("href", "javascript: void(0);");
                    aSub.setAttribute("aria-expanded", "true");
                    aSub.className = "has-arrow";
                    //Add link to conatiner (a to li)
                    subMenuElement.appendChild(aSub);
                    //Create submenu list (ul)
                    ul = document.createElement("ul");
                    ul.className = MDOM.options.subMenuClass;
                    ul.setAttribute("aria-expanded", "true");
                    //Add submenu list to containet (ul to li)
                    subMenuElement.appendChild(ul);
                    //Add submenu conatiner to main menu (li to main)
                    containerElement?.appendChild(subMenuElement);
                    //Save current submenu list to array
                    //@ts-ignore
                    arrMenuMap[mapInfo.submenu] = ul;
                }
                //Get submenu list from array
                //@ts-ignore
                ul = arrMenuMap[mapInfo.submenu];
                //Add map to submenu list
                ul.appendChild(li);
            }
            else {
                containerElement?.appendChild(li);
            } 
        }
    }

    public setState(mapID:string, map = true) {
        let btn = document.getElementById("map-" + mapID);
        if(btn) btn.className = this.options.menuSelectedClass;
        if(map) {
            this._selectedMap = mapID;
        }
        else {
            this._selectedLayers.push(mapID);
        }
    }

    public setButton(key:string) {
        //@ts-ignore
        let btn = document.getElementById(this.options[key]);
        if(btn) btn.className = this.options.menuSelectedClass;
        if(key == "gpsRouteRecordButton") this._recordRoute = true;
        if(key == "gpsRouteShowButton") this._showRoute = true;
    }

    public showStat(stat:ServerStat):void {
        let el = document.getElementById("mQueue");
        if(el) el.innerHTML = `&nbsp;Queue: ${stat.queue}&nbsp;`;
        el = document.getElementById("mDownload");
        if(el) el.innerHTML = `&nbsp;Downloaded ${stat.download} (${formatBytes(stat.size)}) `;
    }
    public makeRouteList(routeList:Array<RouteList>):void {
        let MDOM = this;
        let routeContainer = document.getElementById(this.options.routeListContainer);
        
        if(routeContainer) {
            routeContainer.innerHTML = "";
            for(let i = 0; i < routeList.length; i++) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.text = routeList[i]['name'];
                a.setAttribute("routeID", routeList[i]['ID']);
                li.appendChild(a);
                routeContainer.appendChild(li);
                a.addEventListener("click", function(ev:MouseEvent) {
                    if(this.className != MDOM.options.menuSelectedClass) {
                        let routeID = 0;
                        for(let i = 0; i < this.attributes.length; i++) {
                            if (this.attributes[i].name == "routeid") {
                                routeID = parseInt(this.attributes[i].value);
                            }
                        } 
                        if(routeID > 0) {
                            MDOM._fire(EventType.historyShow, routeID);
                            this.className = MDOM.options.menuSelectedClass;
                        }
                    }
                    
                });
            }
        }
    }

    public on(event:EventType, callback:CallableFunction) {
        const values = Object.values(EventType);
        if (values.includes(event as unknown as EventType)) {
            //If no any callbacks list
                //@ts-ignore
                if(!this._callbacks[event]) {
                    //Make empty list
                    //@ts-ignore
                    this._callbacks[event] = [];
                }
                //Push function to callbacks list
                //@ts-ignore
                this._callbacks[event].push(callback);
        }
        else {
            console.log(event, "Wrong event type. Pls check it again");
        }
    } 

    private _fire(event:EventType, data:any = false, data1:any = false, data2:any = false, data3:any = false) {
        //@ts-ignore
        let callBackArray = this._callbacks[event];
        if(callBackArray?.length > 0) {
            for(let i = 0; i < callBackArray.length; i++) {
                let callback = callBackArray[i];
                callback(data, data1, data2, data3);
            }
        }
    }
}