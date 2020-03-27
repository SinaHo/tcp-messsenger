module.exports = {
  "set-name"(client, req) {
    client.name = req.data.name;
    client.socket.write(
      JSON.stringify({
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
    const prevClient = Client.findById(req.data.clientId);
    if (prevClient) {
      client.getFromOldConnection(prevClient);
      client.socket.write(
        JSON.stringify({
          type: "response",
          status: 200,
          body: { dataType: "clientId", data: client._id }
        })
      );
      return "done";
    }
    client.socket.write(
      JSON.stringify({
        type: "response",
        status: 400,
        body: {
          error: "couldn't regain client",
          dataType: "clientId",
          data: client._id
        }
      })
    );
    return "error";
  },
  broadcast(client, req) {
    console.log("req.data.text = ", req.data.text);

    client.__class__.clients.forEach(cl =>
      cl.socket.write(
        JSON.stringify({
          type: "event",
          status: 200,
          body: {
            dataType: "broadcast",
            data: req.data.text,
            sender: client._id,
            senderName: client.name
          }
        })
      )
    );
  }
};
