const net = require("net");
const { host, port } = require("./config");
const { Client } = require("./datatypes");
const { syncSleep, asyncSleep } = require("./utils");
const handler = require("./handlers");
const server = net.createServer();
server.listen(port, host, () => {
  console.log(`tcp server started on port {${port}}`);
});

server.on("connection", function(sock) {
  //   console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
  const _this = new Client(sock);
  sock.write({
    type: "response",
    status: 200,
    body: { dataType: "clientId", data: _this._id }
  });
  sock.on("data", function(data) {
    let req;
    try {
      req = JSON.parse(data);
    } catch (error) {
      sock.write(
        JSON.stringify({
          type: "response",
          status: 400,
          body: { error: "invalid json format" }
        })
      ); // who says our responose codes can't be like http response codes?
    }
    let resp = handler("server", _this, req);
  });
  sock.on("close", function(data) {
    _this.online = false;
  });
});
