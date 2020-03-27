const { question } = require("../utils");

const resTypes = {
  RESPONSE: "response",
  EVENT: "event",
  REQUEST: "request"
};
const methods = {
  response: {
    regain: function(client, res) {
      if (res.status !== 200) {
        question(
          "id regain process gone wrong you may need to change your name",
          answer => {
            client.socket.write(
              JSON.stringify({
                methodName: "set-name",
                data: {
                  name: answer
                }
              })
            );
          }
        );
      }
    }
  },
  event: {
    broadcast(client, res) {
      console.log(
        `BROADCAST :$${res.body.data}$from <${res.body.sender}> name [${res.body.senderName}]`
      );
    }
  },
  request: {}
};
module.exports = function(client, res) {
  console.log(res);
  if (res.type === "response") {
    return typeof methods.response[res.body.methodName] === "function"
      ? methods.response[res.body.methodName](client, res)
      : "nothing important";
  } else if (res.type === "event") {
    return methods.event[res.body.event](client, res);
  } else if (res.type === "request") {
    methods.request[res.body.request](client, res);
  }
};
