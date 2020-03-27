const net = require("net");
const client = new net.Socket();
const { host, port } = require("./config");

let id;

client.on("data", function(data) {
  id = data.toString();
  console.log("data = ", data.toString());
});
client.connect(port, host, function() {
  console.log("Connected");
  client.write(
    JSON.stringify({
      methodName: "set-name",
      data: {
        name: "sina"
      }
    })
  );
  setTimeout(() => {
    client.destroy();
  }, 2000);
});

setTimeout(() => {
  client.connect(port, host, function() {
    console.log("Connected");
    //   client.write("Hello From Client " + client.address().address);
    client.write(
      JSON.stringify({
        methodName: "regain",
        data: {
          clientId: id
        }
      })
    );
  });
}, 3000);
