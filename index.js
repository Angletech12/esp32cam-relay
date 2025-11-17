const express = require("express");
const WebSocket = require("ws");

const app = express();
let lastFrame = null;

app.get("/", (req, res) => {
  res.send("ESP32-CAM WebSocket Relay Running");
});

app.get("/frame.jpg", (req, res) => {
  if (!lastFrame) return res.status(404).send("No frame yet");
  res.set("Content-Type", "image/jpeg");
  res.send(lastFrame);
});

const server = app.listen(process.env.PORT || 3000, () =>
  console.log("HTTP server running")
);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("ESP32 connected via WebSocket");

  ws.on("message", (msg) => {
    lastFrame = msg; // store JPEG buffer
  });
});
