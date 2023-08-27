export function formatBytes(bytes:number, decimals = 2):string {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
export function secondsToHms(d:number):string {
     d = Number(d);
     var h = Math.floor(d / 3600);
     var m = Math.floor(d % 3600 / 60);
     var s = Math.floor(d % 3600 % 60);
 
     let hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h(s), ") : "";
     
     let mDisplay = "";

     if(h > 0) {
        if(m < 10) {
            mDisplay += "0";
        }
        mDisplay += m.toString() + "m, ";
 
     }
     else {
        mDisplay = m > 0 ? m + " m, " : "";
     }

     let sDisplay = "";

     if(m > 0) {
        if(s < 10) {
            sDisplay += "0";
        }
        sDisplay += s.toString() + "s";
     }
     else {
        sDisplay = s + " s";
     }
     
      
     return `${hDisplay}${mDisplay}${sDisplay}`;
 }