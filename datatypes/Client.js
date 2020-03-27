"use strict";
const shortid = require("shortid");

const clients = [];
class Client {
  constructor(socket, name = "no-name") {
    this.socket = socket;
    this.name = name;
    this._id = shortid.generate();
    this.online = true;
    // socket.on("close", data => {
    //   this.disconnect();
    //   console.log("data in onClose : ", data);
    // });
    clients.push(this);
  }
  disconnect() {
    let index = clients.findIndex(cl => cl._id === this._id);
    if (index !== -1) clients.splice(index, 1);
  }
  getFromOldConnection(oldClient) {
    if (this.online && !oldClient.online) {
      this.name = oldClient.name;
      this._id = oldClient._id;
      oldClient.disconnect();
    }
  }
  static findById(id) {
    return clients.find(cl => cl._id === id);
  }
  static findByAddress(address, port) {
    return clients.find(
      cl => cl.socket.remoteAddress == address && cl.socket.remotePort == port
    );
  }
  static findBySocket(socket) {
    return Client.findByAddress(socket.remoteAddress, socket.remotePort);
  }
  static get clients() {
    return clients;
  }
  get __class__() {
    return Client;
  }
}

module.exports = Client;
