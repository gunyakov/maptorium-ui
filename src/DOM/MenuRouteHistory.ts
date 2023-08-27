//-----------------------------------------------------------------------------------------------
//SERVER API
//-----------------------------------------------------------------------------------------------
import jsonData from "../serverdata";
//-----------------------------------------------------------------------------------------------
//GPS INFO ON MAP
//-----------------------------------------------------------------------------------------------
import GPSInfo from "../DOM/GPSInfo";
//-----------------------------------------------------------------------------------------------
//WAIT FUNCTION
//-----------------------------------------------------------------------------------------------
import { wait } from "../helpers/wait";
//-----------------------------------------------------------------------------------------------
//CALLBACKS
//-----------------------------------------------------------------------------------------------
import { fire } from "../helpers/callbacks";
import { EventType } from "../enum";
//-----------------------------------------------------------------------------------------------
//POP UP alerts wrapper
//-----------------------------------------------------------------------------------------------
import Alerts from "../alerts";
class MenuRouteList {

    private _container:HTMLElement | null = null;
    private _drawingProgressEl: HTMLElement | null = null;
    private _showBtnEl: HTMLElement | null = null;
    private _prgBar:HTMLElement | null = null;
    private _drawHistory:boolean = false;
    private _showRoute:boolean = false;
     
    private _options = {
        ID: 'route-list',
        showBtnEl: "gps-show-route",
        cleanBtnEl: "gps-clear-history",
        selectedClass: "bg-secondary",
        routeProgressContainer: {
            ID: "drawingRouteProgress",
            cancelBtnEl: "[m-action=cancel]",
            infoTxtEl: "[m-data=descr]",
            progressBarEl: ".progress-bar",
        },
        animateRoute: true
    }
    /**
     * Class responsible for building route history menu
     * and handle this menu clicks
     */
    constructor() {
        let thisClass = this;
        this._container = document.getElementById(this._options.ID);
        this._drawingProgressEl = document.getElementById(this._options.routeProgressContainer.ID);
        if(this._drawingProgressEl == null) console.log("Maptorium. Cant find Route Drawing Progress Element. It will be limited functionality.");
        else {
            this._prgBar = this._drawingProgressEl?.querySelector(this._options.routeProgressContainer.progressBarEl);
            this._drawingProgressEl.querySelector(this._options.routeProgressContainer.cancelBtnEl)?.addEventListener("click", () => {
                if(thisClass._drawHistory) thisClass._drawHistory = false;
                if(thisClass._showRoute) thisClass._showRoute = false;
            });
        }
        document.getElementById(this._options.cleanBtnEl)?.addEventListener("click", (ev:MouseEvent) => {
            thisClass._drawHistory = false;
            fire(EventType.historyHide);
            thisClass._container?.querySelectorAll("a").forEach((el) => {
                el.classList.remove(thisClass._options.selectedClass);
            })
        });
        
        this._showBtnEl = document.getElementById(thisClass._options.showBtnEl);
        if(this._showBtnEl != null) {
            this._showBtnEl.addEventListener("mouseup", async (ev:MouseEvent) => {
                if(thisClass._showRoute) {
                    thisClass._showRoute = GPSInfo.routeShow = false;
                    thisClass._showBtnEl?.classList.remove(thisClass._options.selectedClass);
                    fire(EventType.routeHide);
                    jsonData.setDefConfig({showRoute: thisClass._showRoute}); 
                }
                else {
                    if(await thisClass._getRoute()) {
                        thisClass._showBtnEl?.classList.add(thisClass._options.selectedClass);
                        jsonData.setDefConfig({showRoute: thisClass._showRoute}); 
                    }
                }
            });
        }
        else console.log("Cant find GPS Route History Button. It will be limited functionality.");
    }
    /**
     * Ask server for routes list and build menu with this list
     */
    public async make() {
        let thisClass = this;
        if(thisClass._container) {
            let routeList = await jsonData.getRouteList();
            thisClass._container.innerHTML = ""; 
            for(let i = 0; i < routeList.length; i++) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.text = routeList[i]['name'];
                a.setAttribute("routeID", routeList[i]['ID']);
                li.appendChild(a);
                thisClass._container.appendChild(li);
                a.addEventListener("click", async function(ev:MouseEvent) {
                    if(this.className != thisClass._options.selectedClass) {
                        let routeID = 0;
                        for(let i = 0; i < this.attributes.length; i++) {
                            if (this.attributes[i].name == "routeid") {
                                routeID = parseInt(this.attributes[i].value);
                            }
                        } 
                        if(routeID > 0) {
                            if(await thisClass._getRoute(routeID)) this.className = thisClass._options.selectedClass;
                        }
                    }
                });
            }
        }
    }
    /**
     * Ask server for current route points and send this to map handler
     */
    public async showRoute() {
        GPSInfo.routeShow = true;
        if(await this._getRoute()) this._showBtnEl?.classList.add(this._options.selectedClass);
    }
    /**
     * Ask server for route points and send this points to map handler
     * @param {number} routeID 
     * @returns boolean
     */
    private async _getRoute(routeID:number = 0):Promise<boolean> {
        //If function is drawing route currently
        if( this._drawingProgressEl?.style.display == "block") {
            //Show alert
            Alerts.warning("Route is drawing. Pls wait until drawing end and retry after.");
            //Exit from function
            return false;
        }
        //Get route points from server
        let data = await jsonData.getRouteHistory(routeID);
        //If route have points 
        if(data.length > 0) {
            //If not required animate route drawing
            if(!this._options.animateRoute) {
                if(routeID > 0) fire(EventType.historyShow, routeID, data);
                else {
                    fire(EventType.routeShow, data);
                    GPSInfo.setDistance(data);
                }
            }
            //If require aniamte route drawing
            else {
                let result = true;
                //Show status element
                this._showProgressEl();
                //Get first 2 points to draw basic polyline
                let arrPoints = [];
                arrPoints.push(data[0]);
                arrPoints.push(data[1]);
                //Fire history.show if its history route
                if(routeID > 0) {
                    this._drawHistory = true;
                    fire(EventType.historyShow, routeID, arrPoints);
                }
                //Fire route.show if its current route
                else {   
                    this._showRoute = true;
                    GPSInfo.setDistance(arrPoints);
                    //Set that this is priority draw, to skip any other points during drawing
                    GPSInfo.onlyPriorityPoints = true;
                    fire(EventType.routeShow, arrPoints);
                }
    
                let counter = 0;
    
                for(let i = 2; i < data.length; i++) {
    
                    if(routeID == 0) GPSInfo.setRoutePoint(data[i].lat, data[i].lng, true);
    
                    else fire(EventType.historyPoint, routeID, data[i].lat, data[i].lng);
    
                    this._text(`Drawing rote. Processed ${i} from ${data.length} points.`);
 
                    let progress = Math.floor(i / data.length * 100);

                    if(this._prgBar) this._prgBar.style.width = `${progress}%`;
                    
                    counter++;
                    if(counter > 5) {
                        await wait(1);
                        counter = 0;
                    }
                    //Exit if Show route button was unpressed
                    if(routeID == 0 && !this._showRoute) {
                        result = false;
                        break;
                    }
                    //Exit if hide history button was pressed
                    if(routeID > 0 && !this._drawHistory) {
                        result = false;
                        break;
                    }
                }
    
                this._hideProgressEl();
                if(routeID == 0) {
                    GPSInfo.onlyPriorityPoints = false;
                    GPSInfo.addSkipped();
                }
                if(!result) Alerts.warning("Route drawing has been canceled.");
                return result;
            }
            return true;
        }
        else return false;
    }
    private _text(value:string) {
        let infoEl = this._drawingProgressEl?.querySelector(this._options.routeProgressContainer.infoTxtEl) as HTMLElement;
        if(infoEl != null && infoEl != undefined) {
            infoEl.innerHTML = value;
        }
    }
    /**
     * Show element what show progress of route drawing
     */
    private _showProgressEl() {
        if(this._drawingProgressEl) this._drawingProgressEl.style.display = "block";
    }
    /**
     * Hide element what show progress of route drawing
     */
    private _hideProgressEl() {
        if(this._drawingProgressEl) this._drawingProgressEl.style.display = "none";
    }
}

export default new MenuRouteList();