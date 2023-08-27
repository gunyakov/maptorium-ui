import socket from "../socket";

import { LogType, LogModules } from "../enum";

let messageEl = document.getElementById("messageEl");

let itemEl = messageEl?.querySelector("a");

if(messageEl) messageEl.innerHTML = "";

let messageCounter = 0;

socket.on("message", (data:{module: LogModules, type:LogType, message: string, time:number}) => {
    //@ts-ignore
    document.getElementById("mLog")?.innerHTML = data.message;
    generateMessage(data.module, data.type, data.message, data.time);
});

export default function generateMessage(module: LogModules, type:LogType, message: string, time:number) {
    messageCounter++;
    //@ts-ignore
    document.querySelector("[data-m=messageCounter]")?.innerHTML = messageCounter;
    let item = itemEl?.cloneNode(true) as HTMLElement;
    //@ts-ignore
    item.querySelector("h6")?.innerHTML = module;
    item.querySelector("h6")?.classList.add(`text-${type}`);
    //@ts-ignore
    item.querySelector("[data-m=message]")?.innerHTML = message;
    let date = new Date(time);
    //@ts-ignore
    item.querySelector("[data-m=time]")?.innerHTML = date.getDay() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    messageEl?.appendChild(item);
    try {
        //@ts-ignore
        let some = SimpleBar(messageEl, {});
    }
    catch(e) {
        //console.log(e);
    }
}