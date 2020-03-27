const net = require("net");
const { host, port } = require("./config");
// const {Client} = require("./datatypes")
const handler = require("./handlers");
const client = new net.Socket();
client.on("data", function(data) {
  let req;
  // console.log(data.toString());
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
  let resp = handler("client", _this, req);
});

let _this = { socket: client };

const question = require("./utils/question");

client.connect(port, host, function() {
  let name;
  let alreadyConnected = false;
  question("Have you already connected? [YOUR_TOKEN/-n] ", answer => {
    if (answer !== "-n") {
      client.write(
        JSON.stringify({
          methodName: "regain",
          data: {
            clientId: answer
          }
        })
      );

      client.write(
        JSON.stringify({
          methodName: "broadcast",
          data: {
            text: "A MESSAGE :={}"
          }
        })
      );
    } else {
      question("What is your name ? ", answer => {
        if (!!answer && answer !== "") {
          client.write(
            JSON.stringify({
              methodName: "set-name",
              data: {
                name: answer
              }
            })
          );
          _this.name = answer;
        }
      });
    }
  });
});
