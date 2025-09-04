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

// Used for Task 2
var timestamps = new Array();

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

    // TASK 2

    if (typeof battTemp === "number" && isFloat) {

      // TASK 2
      
      if (battTemp > 80 || battTemp < 20) {
        timestamps.push(msgJson.timestamp);
      }

      // check if the array has entries before iterating, to prevent runtime errors
      const tLen = timestamps.length;
      while (tLen > 1 && (timestamps[tLen - 1] - timestamps[0] > 5000)) {
        // if the earliest (first) timestamp added is older than 5 seconds, remove it
        timestamps.shift();
      }

      if (timestamps.length >= 3) {
        console.log(`WARNING: the battery temperature has exceeded the 
          accepted range more than 3 times in the last 5 seconds!`);
      }

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
