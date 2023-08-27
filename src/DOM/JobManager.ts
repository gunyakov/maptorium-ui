import jsonData from "../serverdata";
import { formatBytes } from "../helpers/formatBytes";
import { secondsToHms } from "../helpers/formatBytes";
import { JobType } from "../enum";

class HTMLJobElement { //extends HTMLElement {

    private _timer:NodeJS.Timer = setTimeout(() => {}, 1000);
    private _btnPlay:HTMLElement | null;
    private _running:boolean = false;
    private _element:HTMLElement

    private _options = {
        stateTxtEl: "[m-id=state]",
        descrTxtEl: "[m-id=descr]",
        playBtnEl: {
            selector: "[m-id=btn-play]",
            iconEl: "i",
            playCls: "bx-play",
            stopCls: "bx-pause"
        },
        upBtnEl: "[m-action=btn-up]",
        downBtnEl: "[m-action=btn-down]",
        deleteBtn: "[m-action=btn-delete]"
    }
    constructor(element: HTMLElement, jobID: string, mapID:string) {
        //super();
        this._element = element;
        this._btnPlay = this._element.querySelector(this._options.playBtnEl.selector);
        this._element.setAttribute("m-jobid", jobID);
        //Button Job UP click event
        this._element.querySelector(this._options.upBtnEl)?.addEventListener("click", async () => {
            if(await jsonData.jobUp(jobID)) refreshJobList();
        });
        //Button Job Delete click event
        this._element.querySelector(this._options.deleteBtn)?.addEventListener("click", async () => {
            if(await jsonData.jobDelete(jobID)) refreshJobList();
        });
        //Button Job Down click event
        this._element.querySelector(this._options.downBtnEl)?.addEventListener("click", async () => {
            if(await jsonData.jobDown(jobID)) refreshJobList();
        });
        //If button play was clicked
        this._btnPlay?.addEventListener("click", async (e) => {
            //If job is running
            if(this._running) {
                //Send request to server to stop job and if OK, stop animation
                if(await jsonData.jobStop(jobID)) this.stopAnimation();
            }
            //If job is stoped
            else {
                //Send request to server to start job and if OK, start animation
                if(await jsonData.jobStart(jobID)) this.startAnimation();
            }
        });
        this._text(this._options.descrTxtEl, mapID);
        this._attr("[data-bs-toggle=collapse]", "data-bs-target", `#collapseJob-${jobID}`);
        this._attr(".accordion-collapse", "id", `collapseJob-${jobID}`);
    } 
    /**
     * Put text in innerHTML for element
     * @param {string} key - Element key for querySelector
     * @param {string} value - String what will be as InnerHTML
     * @param {boolean} add - Set if require replace innerHTML or add string to innerHTML 
     */
    private _text(key: string, value: string, add:boolean = false):void {
        let el = this._element.querySelector(key) as HTMLElement;
        if(el != null) add ? el.innerHTML += value : el.innerHTML = value;
    }
    //Set attr for element
    private _attr(key:string, attr:string, value:string) {
        let el = this._element.querySelector(key) as HTMLElement;
        if(el != null) el.setAttribute(attr, value);
    }
    //Change icon for button play
    private _playIcon(play:boolean) {
        if(this._btnPlay != null) {
            let el = this._btnPlay?.querySelector(this._options.playBtnEl.iconEl);
            if(el != null) {
                if(!play) {
                    el.classList.remove(this._options.playBtnEl.stopCls);
                    el.classList.add(this._options.playBtnEl.playCls);
                }
                else {
                    el.classList.remove(this._options.playBtnEl.playCls);
                    el.classList.add(this._options.playBtnEl.stopCls);
                }
            }
        }
    }
    //Write text in stat block
    public setStat(queue:number, total: number, time:number, size: number, empty:number, skip:number, error:number) {
        
        let progressValue = Math.floor((total - queue) / total * 1000) / 10;
        let progresBar = this._element.querySelector(".progress-bar") as HTMLElement;
        progresBar.style.width = `${Math.floor(progressValue)}%`;
        progresBar.setAttribute("valuenow", progressValue.toString());

        this._text("[m-id=size]", formatBytes(size));

        this._text("[m-id=tiles]", `${total - queue} from ${total} (${progressValue}%)`);

        this._text("[m-id=time]", secondsToHms(time));

        let etaTime = Math.floor(time / (total - queue) * queue);
        this._text("[m-id=eta]", secondsToHms(etaTime));

        this._text("[m-id=ese]", `${empty}/${skip}/${error}`);
    }
    //Start animation function
    public startAnimation() {
        clearInterval(this._timer);
        this._running = true;
        this._playIcon(true);
        this._text(this._options.stateTxtEl, "Running");
        let a = 0;
        this._timer = setInterval(() => {
            a++;
            this._text(this._options.stateTxtEl, ".", true);
            if(a > 35) {
                a = 0;
                this._text(this._options.stateTxtEl, "Running");
            }
        }, 100);
    }
    //Stop animation function
    public stopAnimation() {
        clearInterval(this._timer);
        this._running = false;
        this._playIcon(false);
        this._text(this._options.stateTxtEl, "Paused.");
    }
    public get element() {
        return this._element;
    }
}
//Init
let jobsElList:{[id:string]: HTMLJobElement} = {};

let jobManager = document.getElementById("jobManager") as HTMLElement;

let jobMamagerItem = jobManager?.querySelector(".accordion-item")?.cloneNode(true) as HTMLElement;

//Object.setPrototypeOf(jobMamagerItem, HTMLJobElement.prototype);

export async function generateJobList(arrJobs:Array<{ID:string, running:boolean, mapID:string, type: JobType}>) {

    for(let i = 0; i < arrJobs.length; i++) {
        let jobInfo = arrJobs[i];
        //Create job element
        let el = jobMamagerItem?.cloneNode(true) as HTMLElement;
        jobsElList[jobInfo.ID] = new HTMLJobElement(el, jobInfo.ID, jobInfo.mapID);
        Object.setPrototypeOf(jobsElList[jobInfo.ID], HTMLJobElement.prototype);
        //Add element to parent element
        jobManager?.appendChild(jobsElList[jobInfo.ID].element);
        //If job started, start animation 
        if(jobInfo.running) jobsElList[jobInfo.ID].startAnimation();
    }
}

document.getElementById("job-manager-btn")?.addEventListener("click", async function(e) {
    let btn = e.target as HTMLElement;
    let state = btn.classList.contains("bg-secondary");
    if(await jsonData.setDefConfig({jobManager: state})) {
        setJobManagerState(state);
    }
});

export async function setJobManagerState(state:boolean) {
    let btn = document.getElementById("job-manager-btn");
    if(state) {
        btn?.classList.remove("bg-secondary");
        //@ts-ignore
        jobManager?.style.display = "none";
    }
    else {
        btn?.classList.add("bg-secondary");
        //@ts-ignore
        jobManager?.style.display = "block";
    }
}

export async function refreshJobList() {

    if(jobManager) jobManager.innerHTML = "";
    
    let result = await jsonData.getJobsList();
    
    if(result) {
        generateJobList(result);
    }
}

export function setJobStat(jobID:string, queue:number, total: number, time:number, size: number, empty:number, skip:number, error:number) {
    jobsElList[jobID].setStat(queue, total, time, size, empty, skip, error);
}