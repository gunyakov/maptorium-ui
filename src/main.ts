
//import {version} from '../package.json';
//export {version};
// main

//import Maptorium from "./maptorium.js";
//import DOM from "./DOM.js";

import MDOM from './MDOM';
import Maptorium from './maptorium';

let M = {
    Maptorium: Maptorium,
    MDOM:MDOM
}

export default M;
//@ts-ignore
getGlobalObject().M = M;

function getGlobalObject() {
	if (typeof globalThis !== 'undefined') { return globalThis; }
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	//if (typeof global !== 'undefined') { return global; }

	throw new Error('Unable to locate global object.');
}


