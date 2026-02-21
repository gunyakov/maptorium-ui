import { io, type Socket } from 'socket.io-client';

//-----------------------------------------------------------------------------------------------
//SOCKET IO INIT
//-----------------------------------------------------------------------------------------------
const socket: Socket = io();
//-----------------------------------------------------------------------------------------------
//SOCKET DISCONNECT
//-----------------------------------------------------------------------------------------------
socket.on('disconnect', () => {
  console.log('Disconnected');
});
socket.on('connect', () => {
  //refreshJobList()
});
//-----------------------------------------------------------------------------------------------
//SOCKET IO EVENTS
//-----------------------------------------------------------------------------------------------
// socket.on('cachedtile.map', (data: CachedTilesInfo) => {
//   fire(EventType.cachedTileMap, data)
// })
// //Update state for cached bar
// socket.on('cachedtile.progress', (data: { tiles: number; total: number }) => {
//   ModalCachedMap.setCachedBar(data.tiles, data.total)
// })
// socket.on('cachedtile.tile', (data: { x: number; y: number; state: TileInCache }) => {
//   fire(EventType.cachedTileMapTile, data)
// })

export default socket;
