//-----------------------------------------------------------------------------------------------
//SERVER API
//-----------------------------------------------------------------------------------------------
import jsonData from "../serverdata";
//-----------------------------------------------------------------------------------------------
//CALLBACKS
//-----------------------------------------------------------------------------------------------
import { fire } from "../helpers/callbacks";
import { EventType } from "../enum";
//-----------------------------------------------------------------------------------------------
//INTERFACE
//-----------------------------------------------------------------------------------------------
import { MapList } from "../interfases";
//-----------------------------------------------------------------------------------------------
//CONFIG
//-----------------------------------------------------------------------------------------------
import config from "../config";
//-----------------------------------------------------------------------------------------------
//HELPERS
//-----------------------------------------------------------------------------------------------
import { arrayRemove } from "../helpers/array";

let MAPMenu = {

    _selectedMap: "" as string,
    _selectedLayers: [] as Array<string>,
     
    makeMenu: async function(mapList:Array<MapList>, bmapMenu:boolean = true) {

        let containerElement:HTMLElement | null;
        if(bmapMenu) {
            containerElement = document.getElementById(config.mapsContainerID);
        }
        else {
            containerElement = document.getElementById(config.layersContainerID);
        }

        let downloadMapList = document.getElementById(config.downloadMapList);
        let generateMapList = document.getElementById(config.genMapModal.mapsListID);
        let cachedMapList = document.getElementById(config.cachedMapList);

        for(let i = 0; i < mapList.length; i++) {
            //----------------------------------------------------
            //Get info about map
            //----------------------------------------------------
            let mapInfo = mapList[i];
            //----------------------------------------------------
            //Make UL list for Download Tiles window
            //----------------------------------------------------
            let downloadOption = document.createElement("option");
            downloadOption.text = mapInfo.name;
            downloadOption.setAttribute("value", mapInfo.id);
            downloadMapList?.appendChild(downloadOption);
            generateMapList?.appendChild(downloadOption.cloneNode(true));
            cachedMapList?.appendChild(downloadOption.cloneNode(true));
            //----------------------------------------------------
            //Create menu link
            //----------------------------------------------------
            let li = makeMenuBtn(mapInfo.id, mapInfo.name, bmapMenu? "map" : "layer");

            if(mapInfo.submenu) {
                let ul = containerElement?.querySelector(`[m-submenu=${mapInfo.submenu}]`);
                //If have no submenu to insert map item
                if(ul == null) {             
                    //Add submenu conatiner to main menu (li to main) and insert LI element
                    containerElement?.appendChild(makeMenuList(mapInfo.submenu, li));
                }
                else {
                    //Add map to submenu list
                    ul?.appendChild(li);
                }
            }
            else {
                containerElement?.appendChild(li);
            } 
        }

    },

    setState: async function(mapID:string, map = true) {
        let btn = document.getElementById("map-" + mapID);
        if(btn) btn.className = config.menuSelectedClass;
        if(map) {
            this._selectedMap = mapID;
        }
        else {
            this._selectedLayers.push(mapID);
        }
    }
}

export default MAPMenu;

function makeMenuBtn(mapID:string, name:string, layer:string):HTMLLIElement {

    let li = document.createElement("li") as HTMLLIElement;
    li.className = config.menuParrentClass;
    let a = document.createElement("a");
    a.setAttribute("map-id", mapID);
    a.setAttribute("id", "map-" + mapID);
    //@ts-ignore
    a.setAttribute("layer", layer);
    
    a.className = config.menuChildClass;
    //@ts-ignore
    a.text = name;
    
    a.addEventListener("click", mapElementClickHandle);

    li.appendChild(a);

    return li;
}

function makeMenuList(menuID:string, li:HTMLLIElement):HTMLLIElement {
    //Init new submenu container (li)
    let subMenuElement = document.createElement("li") as HTMLLIElement;
    //Create submenu link (a)
    let aSub = document.createElement("a");
    //Set submenu text
    //@ts-ignore
    aSub.text = menuID;
    aSub.setAttribute("href", "javascript: void(0);");
    aSub.setAttribute("aria-expanded", "true");
    aSub.className = "has-arrow";
    //Add link to conatiner (a to li)
    subMenuElement.appendChild(aSub);
    //Create submenu list (ul)
    let ul = document.createElement("ul");
    ul.className = config.subMenuClass;
    ul.setAttribute("aria-expanded", "true");
    ul.setAttribute("m-submenu", menuID);
    //Add map to submenu list
    ul?.appendChild(li);
    //Add submenu list to containet (ul to li)
    subMenuElement.appendChild(ul);
    return subMenuElement;
}

function mapElementClickHandle(ev:MouseEvent) {
    let btnThis = ev.target as HTMLButtonElement;
    ev.preventDefault();
    ev.stopPropagation();
    let mapID = "";
    let layer = "";
    for(let i = 0; i < btnThis.attributes.length; i++) {
        if (btnThis.attributes[i].name == "map-id") {
            mapID = btnThis.attributes[i].value;
        }
        if (btnThis.attributes[i].name == "layer") {
            layer = btnThis.attributes[i].value;
        }
    }
    if( mapID ) {
        if(layer == "map") {
            if(MAPMenu._selectedMap != mapID) {
                fire(EventType.mapChangeMap, mapID, MAPMenu._selectedMap);
                btnThis.className = config.menuSelectedClass;
                let btn = document.getElementById("map-" + MAPMenu._selectedMap);
                if(btn) btn.className = '';
                MAPMenu._selectedMap = mapID;
                jsonData.setDefConfig({map: mapID});
            }
        }
        else {
            //Check if we have layer added to map
            const index = MAPMenu._selectedLayers.indexOf(mapID);

            let btn = document.getElementById("map-" + mapID);

            if(index == -1) {
                fire(EventType.mapAddLayer, mapID);
                if(btn) btn.className = config.menuSelectedClass;
                MAPMenu._selectedLayers.push(mapID);
            }
            else {
                fire(EventType.mapRemoveLayer, mapID);
                if(btn) btn.className = "";
                MAPMenu._selectedLayers = arrayRemove(MAPMenu._selectedLayers, mapID);
            }
            jsonData.setDefConfig({layers: MAPMenu._selectedLayers});
        }  
    }
}