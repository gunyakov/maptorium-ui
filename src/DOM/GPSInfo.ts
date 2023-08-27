import jsonData from "../serverdata";
import { GPSCoords } from "../interfases";
import * as turf from "@turf/turf";
import { fire } from "../helpers/callbacks";
import { EventType } from "../enum";
import config from "../config";

let btnGPSInfo = document.getElementById("gps-info");

let elGPS = document.getElementById("routeInfo");

let elCurDistance = elGPS?.querySelector("[data-m=cur-distance]");
let sogEl = elGPS?.querySelector("[data-m=sog]");
let courseEl = elGPS?.querySelector("[data-m=course]");
let timeToGoEl = elGPS?.querySelector("[data-m=time-to-go]");
let distanceToGoEl = elGPS?.querySelector("[data-m=distance-to-go]");
let markLatEl = document.querySelector("[name=lat]");
let markLngEl = document.querySelector("[name=lng]");
let gpsToCenterMapBtn = document.getElementById(config.gpsInfoCenterMapBtnID);

let GPSInfo = {

    curDistance: 0,
    distanceToGo: 0,
    routeShow: false,
    lastGPS: [] as Array<{lat: number, lng: number, time: number}>,
    lastPoint: {lat: 0, lng: 0},
    skipedPoints: [] as Array<GPSCoords>,
    onlyPriorityPoints: false,
    gpsToCenterMap: false,

    setInfoState: function(state:boolean) {
        if(state) {
            btnGPSInfo?.classList.remove("bg-secondary");
            //@ts-ignore
            elGPS?.style.display = "none";
        }
        else {
            btnGPSInfo?.classList.add("bg-secondary");
            //@ts-ignore
            elGPS?.style.display = "block";
        }
    },

    setDistance: function(points:Array<GPSCoords>) {
        this.curDistance = 0;
        this.lastPoint.lat = points[0].lat;
        this.lastPoint.lng = points[0].lng;
        for(let i = 1; i < points.length; i++) {
            this.setRoutePoint(points[i].lat, points[i].lng);
        }
    },

    setRoutePoint(lat:number, lng:number, priorityPoint = false) {
        if(!priorityPoint && this.onlyPriorityPoints) {
            this.skipedPoints.push({lat, lng, dir:0});
            return;
        }

        let distance = turf.distance([this.lastPoint.lng, this.lastPoint.lat], [lng, lat], {units: 'kilometers'});
        
        this.curDistance += distance;
        
        //@ts-ignore
        elCurDistance?.innerHTML = (Math.floor(this.curDistance / 1.852 * 100) / 100).toString() + " miles";
        if(this.distanceToGo > 0 && this.curDistance > 0) {
            //@ts-ignore
            distanceToGoEl?.innerHTML = (Math.floor((this.distanceToGo - this.curDistance / 1.825) * 100) / 100).toString() + " miles.";
        }
        this.lastPoint.lat = lat;
        this.lastPoint.lng = lng;
        //If eneble to show route
        if(this.routeShow) {
            //Fire event
            fire(EventType.routePoint, lat, lng);
        }
    },

    addSkipped: function() {
        for(let i = 0; i < this.skipedPoints.length; i++) {
            this.setRoutePoint(this.skipedPoints[i].lat, this.skipedPoints[i].lng);
        }
        this.skipedPoints = [];
    },

    setCoords(lat:number, lng:number, dir:number) {

        if(typeof dir == "undefined" || dir == 0) {
            let bearing = turf.bearing([this.lastPoint.lat, this.lastPoint.lng], [lat, lng]);
            dir = turf.bearingToAngle(bearing);
        }

        fire(EventType.gpsCoords, lat, lng, dir);

        if(this.gpsToCenterMap) {
            fire(EventType.mapCenter, lat, lng);
        }

        if(markLatEl?.getAttribute("m-fix") != "yes") {
            markLatEl?.setAttribute("value", lat.toString());
            markLngEl?.setAttribute("value", lng.toString());
        }
        //@ts-ignore
        courseEl?.innerHTML = dir + "º";

        let timeNow = Date.now();
        this.lastGPS.push({lat: lat, lng: lng, time: timeNow});
        let timeFirst = this.lastGPS[0].time;

        if(this.lastGPS.length > 1) {
            let dist = 0;
            for(let i = 1; i < this.lastGPS.length; i++) {
                dist += turf.distance([this.lastGPS[i-1].lng, this.lastGPS[i-1].lat], [this.lastGPS[i].lng, this.lastGPS[i].lat], {units: "kilometers"});
            }
            let timeDiff = timeNow - timeFirst;
            dist /= 1.825;
            let speed = Math.floor(3600000 / timeDiff * dist * 100) / 100
            //@ts-ignore
            sogEl?.innerHTML = speed.toString() + " kn.";
            if(this.distanceToGo > 0) {

                let timeToGo = Math.floor((this.distanceToGo - this.curDistance / 1.825) / speed * 3600);

                let dayToGo = Math.floor(timeToGo / 3600 / 24);
                timeToGo -= dayToGo * 3600 * 24;
                let hourToGo = Math.floor( timeToGo / 3600);
                timeToGo -= hourToGo * 3600;
                let minuteToGo = Math.floor(timeToGo / 60);
        
                let dateString = "";
                if(dayToGo < 10) dateString += "0";
                dateString += dayToGo.toString() + "d ";
                if(hourToGo < 10) dateString += "0";
                dateString += hourToGo.toString() + "h ";
                if(minuteToGo < 10) dateString += "0";
                dateString += minuteToGo.toString() + "m";
                //@ts-ignore
                timeToGoEl?.innerHTML = dateString;
            }
        }
        if(this.lastGPS.length > 60) {
            this.lastGPS.shift();
        }
    },
    setDistanceToGo: function(distance:number) {
        this.distanceToGo = distance;
    }
}

export default GPSInfo;

gpsToCenterMapBtn?.addEventListener("click", () => {
    GPSInfo.gpsToCenterMap = !GPSInfo.gpsToCenterMap;
    if(GPSInfo.gpsToCenterMap) {
        gpsToCenterMapBtn?.classList.add("bg-secondary");
    }
    else {
        //@ts-ignore
        gpsToCenterMapBtn?.classList.remove("bg-secondary");
    }
    
});

btnGPSInfo?.addEventListener("click", async() => {
    let state = btnGPSInfo?.classList.contains("bg-secondary") as boolean;
    if(typeof state == "boolean") {
        if(await jsonData.setDefConfig({GPSInfoPanel: state})) {
            GPSInfo.setInfoState(state);
        }
    }
});

let sampleTimeBtn = document.getElementById("gps-sample-time");
sampleTimeBtn?.addEventListener("click", () => {
    //@ts-ignore
    alertify.prompt("Enter new sample rate of GPS position, in seconds.", "60", async (e, t) => {
        jsonData.setGPSSampleTime(t);
    }).set({title: "GPS New sample rate"});
});

let distanceToGoBtn = document.getElementById("gps-distance-to-go");
distanceToGoBtn?.addEventListener("click", () => {
    //@ts-ignore
    alertify.prompt("Enter new distance to go, in miles.", "1000", async (e, t) => {
        if(await jsonData.setDefConfig({ distanceToGo: t })) {
            GPSInfo.distanceToGo = t;
        }
    }).set({title: "GPS Distance To Go"});
});

