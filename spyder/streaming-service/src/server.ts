import net from "net";
import { isNumberObject } from "util/types";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number | string;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString();

    // TASK 1
    const msgJson = JSON.parse(message);
    const battTemp = msgJson.battery_temperature;

    console.log(`Received: ${message}`);

    const battTempString = battTemp.toString();
    var isFloat = true;

    // checks if the battery temperature passed is a number, and then
    // checks if the string of said number includes a decimal point.
    if (Number.isInteger(battTemp) && battTempString.includes(".")) {
      isFloat = false;
    }

    if (typeof battTemp === "number" && isFloat) {
      // Send JSON over WS to frontend clients
      websocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }

    
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
