import { EventType } from "../enum";
//-----------------------------------------------------------------------------------------------
//CALLBACKS LIST AND FIRE FUNCTION
//-----------------------------------------------------------------------------------------------
let _callbacks:Array<CallableFunction> = [];        //Calback array
/**
 * Fire callback according EventType
 * @param {EventType} event - Type of event
 * @param {any} data - First data for callback
 * @param {any} data1 - Second data for callback
 * @param {any} data2 - Third data for callback
 * @param {any} data3 - Forth data for callback
 * @param {any} data4 - Fifth data for callback
 */
export function fire(event:EventType, data:any = false, data1:any = false, data2:any = false, data3:any = false, data4:any = false):void {
    //@ts-ignore
    let callback = _callbacks[event];
    if(callback) {
        callback(data, data1, data2, data3, data4);
    }
    else {
        console.log(`Callback ${event} have no assigned function.`);
    }
}
/**
 * Register callback function to fire when EventType happened.
 * @param {EventType} event - Event type for callback
 * @param callback - Callback function what will be fired
 */
export function on(event:EventType, callback:CallableFunction) {
    const values = Object.values(EventType);
    if (values.includes(event as unknown as EventType)) {
        //Push function to callbacks list
        //@ts-ignore
        _callbacks[event] = callback;
    }
    else {
        console.log("Wrong event type. Pls check it again", event);
    }
} 