module.exports = {
  "set-name"(client, req) {
    client.name = req.data.name;
    client.socket.write(
      JSON.stringify({
        methodName: "set-name",
        type: "response",
        status: 200,
        body: {
          /* dataType: "clientId", data: client._id */
        }
      })
    );
    return "done";
  },
  disconnect(client, req) {
    client.disconnect();
    client.socket.write(
      JSON.stringify({
        methodName: "disconnect",
        type: "response",
        status: 200,
        body: {
          /* dataType: "clientId", data: client._id */
        }
      })
    );
    return "done";
  },
  regain(client, req) {
    const prevClient = client.__class__.findById(req.data.clientId);
    if (prevClient) {
      client.getFromOldConnection(prevClient);
      client.socket.write(
        JSON.stringify({
          type: "response",
          status: 200,
          body: { methodName: "regain", dataType: "clientId", data: client._id }
        })
      );
      return "done";
    }
    client.socket.write(
      JSON.stringify({
        type: "response",
        status: 400,
        body: {
          methodName: "regain",
          error: "couldn't regain client",
          dataType: "clientId",
          data: client._id
        }
      })
    );
    return "error";
  },
  broadcast(client, req) {
    client.__class__.clients.forEach(cl => {
      console.log(cl.name, cl.online.toString());
      try {
        cl._id !== client._id
          ? cl.socket.write(
              JSON.stringify({
                type: "event",
                status: 200,
                body: {
                  event: "broadcast",
                  dataType: "broadcast",
                  data: req.data.text,
                  sender: client._id,
                  senderName: client.name
                }
              })
            )
          : undefined;
      } catch (err) {}
    });
    client.socket.write(
      JSON.stringify({
        type: "response",
        status: 200,
        body: { methodName: "broadcast" }
      })
    );
  }
};
