const { Client } = require("../datatypes");
const serverMethods = require("./server");
const clientMethods = require("./client");

const sides = {
  CLIENT: "client",
  SERVER: "server"
};

module.exports = function(side, socket, req) {
  if (req.methodName) {
    if (side === sides.SERVER) {
      return serverMethods[req.methodName](socket, req);
    } else if (side === sides.CLIENT) {
      clientMethods(socket, req);
    }
  } else {
    //handle defualt
    return "";
  }
};
