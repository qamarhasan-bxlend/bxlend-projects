"use strict";

class Router {
  constructor() {
    this.routes = {};
  }

  getRoutes() {
    return this.routes;
  }

  // Will set a route for routing access
  on(route, handler) {

    // The last one is handler
    this.routes[route] = handler;

    return this;
  }
}

module.exports = Router;
