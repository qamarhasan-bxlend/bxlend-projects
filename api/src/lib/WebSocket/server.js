"use strict";

const { Server } = require("ws");
const { OnConnectionHook, OnDisconnectionHook, OnMessageHook, MessageParserHook, RouterHook, ValidatorHook } = require("./hooks");
const Router = require("./router");
const { connectionParser } = require("./helpers");
const { WebsocketEvents, WebsocketInternalEvents } = require("@src/events");
const uuid = require("uuid");
const { difference } = require("lodash");

const SOCKET_EVENT = {
  CLOSE: "close",
  MESSAGE: "message",
  CONNECTION: "connection",
};

class WSServer {
  
  constructor(options = {}) {

    this.config(options);
    this.routes = {};
    this.server = null;
    this.heartbeatInterval = null;
    this.connections = {};
    this.eventEmitter = WebsocketEvents;
    this.hooks = [
      new MessageParserHook(),
      new RouterHook(),
    ];
    
  }

  config(options = {}){

    const {
      port,
      zlibDeflateChunkSize = 1024,
      zlibDeflateMemLevel = 7,
      zlibDeflateLevel = 3,
      zlibInflateChunkSize = 10 * 1024,
      clientNoContextTakeover = true, // Defaults to negotiated value.
      serverNoContextTakeover = true, // Defaults to negotiated value.
      serverMaxWindowBits = 10, // Defaults to negotiated value.
      concurrencyLimit = 10, // Limits zlib concurrency for perf.
      threshold = 1024, // Size (in bytes) below which messages
    } = options;

    this.configs = {
      port,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: zlibDeflateChunkSize,
          memLevel: zlibDeflateMemLevel,
          level: zlibDeflateLevel,
        },
        zlibInflateOptions: {
          chunkSize: zlibInflateChunkSize,
        },
        clientNoContextTakeover: clientNoContextTakeover,
        serverNoContextTakeover: serverNoContextTakeover,
        serverMaxWindowBits: serverMaxWindowBits,
        concurrencyLimit: concurrencyLimit,
        threshold: threshold,
      },
    };

    return this;

  }


  use(hook, constructorOptions) {

    if(hook instanceof Router) {
      this.routes = {
        ...this.routes,
        ...hook.getRoutes(),
      };
    } else this.hooks.push(new hook({...constructorOptions}));
    return this;

  }

  useFirst(hook, constructorOptions) {

    if(hook instanceof Router) {
      this.routes = {
        ...hook.getRoutes(),
        ...this.routes,
      };
    } else {
      this.hooks.unshift(new hook({...constructorOptions}));
    }
    return this;

  }
  
  filterHooks(hooks, categories){

    const filtredHooks = {};

    for (const category in categories)
      filtredHooks[category] = hooks.filter(h=>h instanceof categories[category]);
    
    return filtredHooks;

  }

  executeHooks(hooks, req, res, hookExecutionPayload){

    for ( const hook of hooks ){
      hook.execute(req,res, hookExecutionPayload);
    }

  }

  listen() {

    const $this = this;
    const hookExecutionPayload = {
      routes: this.routes,
      eventEmitter: this.eventEmitter,
    };
    const filteredHooks = this.filterHooks(this.hooks, {
      onConnectionHook: OnConnectionHook,
      onMessageHook: OnMessageHook,
      onDisconnectionHook: OnDisconnectionHook,
      ValidatorHook: ValidatorHook
    });

    this.server = new Server(this.configs);
    const server = this.server;
    const connections = this.connections;

    this.heartbeatInterval = setInterval(function ping() {
      const currentSocketIds = Array.from(server.clients).map(socket=>socket.id);
      const lastSocketIds = Object.keys(connections);
      const toBeTerminatedSocketIds = difference(lastSocketIds, currentSocketIds);
      toBeTerminatedSocketIds.forEach(toBeTerminatedSocketId=> {
        const connection = connections[toBeTerminatedSocketId];
        delete connections[toBeTerminatedSocketId];
        WebsocketInternalEvents.emit(SOCKET_EVENT.CLOSE, connection);
      });
    }, 100);

    server.on(SOCKET_EVENT.CONNECTION, function incommingConnection(socket, request, client) {
      // Authenticating the user on connection
      const { req, res } = connectionParser(socket, request, client);
      $this.executeHooks(filteredHooks.ValidatorHook, req, res, hookExecutionPayload);

      // Creating a unique random id for every connection
      socket.id = uuid.v4();
      connections[socket.id] = socket;
      
      $this.executeHooks(filteredHooks.onConnectionHook, req, res, hookExecutionPayload);

      socket.on(SOCKET_EVENT.MESSAGE, function incommingMessage(message) {

        const { req, res } = connectionParser(socket, request, client, message);
        $this.executeHooks(filteredHooks.onMessageHook, req, res, hookExecutionPayload);
        
      });

    });

    WebsocketInternalEvents.on(SOCKET_EVENT.CLOSE, function incommingDisconnection() {

      const req = {}, res = {};
      $this.executeHooks(filteredHooks.onDisconnectionHook, req, res, hookExecutionPayload);

    });

    return this;

  }
  
}

module.exports = WSServer;
