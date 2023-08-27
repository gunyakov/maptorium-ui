import request from "../helpers/ajax";
//-------------------------------------------------------------------------------
//Set network mode
//-------------------------------------------------------------------------------
export default async function setMode(mode:string):Promise<void> {
    if(await request("/core/mode", {mode: mode}, "post", true)) {
        drawNewMode(mode);
    }
}
//------------------------------------------------------------
//Network mode change functions
//------------------------------------------------------------
//@ts-ignore
document.querySelectorAll("[data-key=t-change-mode")?.forEach((element) => {
    element.addEventListener("click", function(e) {
        //@ts-ignore
        setMode(e.target.getAttribute("mode-val"));
    });
});

export function drawNewMode(mode:string) {
    document.querySelectorAll("[data-key=t-change-mode")?.forEach((element) => {
        if(element.getAttribute("mode-val") == mode) {
            element.classList.add("bg-secondary");
        }
        else {
            element.classList.remove("bg-secondary");
        }
    });
}