import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

const connections = new Map();

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, request) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const modelId = url.searchParams.get("modelId");

  if (!modelId) {
    ws.close();
    return;
  }

  connections.set(modelId, ws);

  ws.on("close", () => {
    connections.delete(modelId);
  });
});

app.post("/api/send", (req, res) => {
  const { modelId, type, payload } = req.body;
  const client = connections.get(modelId);

  if (!client) {
    return res.json({ ok: false, error: "Modelo no conectado" });
  }

  client.send(JSON.stringify({ type, payload }));
  res.json({ ok: true });
});

const server = app.listen(PORT, () =>
  console.log("Backend corriendo en", PORT)
);

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
