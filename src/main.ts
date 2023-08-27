import Maptorium from './maptorium';
//-----------------------------------------------------------------------------------------------
//SOCKET IO
//-----------------------------------------------------------------------------------------------
import socket from "./socket";
//-----------------------------------------------------------------------------------------------
//SOCKET CONNECT, using to activate socket module execution
//-----------------------------------------------------------------------------------------------
socket.on('connect', () => {
    console.log("Connected"); 
});
//-----------------------------------------------------------------------------------------------
//POIDraw, used to activate module execution
//-----------------------------------------------------------------------------------------------
import { empty } from "./DOM/POIDraw";
empty();
//-----------------------------------------------------------------------------------------------
//M INIT
//-----------------------------------------------------------------------------------------------
let M = new Maptorium();

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


