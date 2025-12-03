const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

// Conexiones por modeloId
const connections = new Map();

app.get("/", (req, res) => {
  res.send("WebSocket backend running");
});

// Endpoint para enviar mensajes
app.post("/api/send", (req, res) => {
  const { modelId, type, payload } = req.body;

  const ws = connections.get(modelId);
  if (!ws || ws.readyState !== 1) {
    return res.json({ ok: false, error: "Modelo no conectado" });
  }

  ws.send(JSON.stringify({ type, payload }));
  res.json({ ok: true });
});

// Servidor HTTP base (Express + WebSocket)
const server = http.createServer(app);

// WebSocket server compartiendo el mismo server
const wss = new WebSocketServer({ noServer: true });

// Recibir upgrade desde Railway
server.on("upgrade", (req, socket, head) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const modelId = url.searchParams.get("modelId");

    if (!modelId) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (wsocket) => {
      wss.emit("connection", wsocket, modelId);
    });
  } catch (err) {
    socket.destroy();
  }
});

// Conexión WebSocket
wss.on("connection", (ws, modelId) => {
  console.log("Widget conectado:", modelId);
  connections.set(modelId, ws);

  ws.on("close", () => {
    console.log("Widget desconectado:", modelId);
    connections.delete(modelId);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Backend corriendo en", PORT));
