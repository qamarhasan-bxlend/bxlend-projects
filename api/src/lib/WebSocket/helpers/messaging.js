"use strict";

function sendMessage(socket,message){
  socket.send(JSON.stringify(message));
}

function broadcastMessage(socket,message){ //TODO: Implement real broadcasting to all of the client
  socket.send(JSON.stringify(message));
}

module.exports = {
  sendMessage,
  broadcastMessage,
};