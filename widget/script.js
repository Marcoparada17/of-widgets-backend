const MODEL_ID = "roman001";

let ws;
let reconnectTimer = null;
let scores = {};
let lastLeader = null;

function connectWS() {
  console.log("🔌 Conectando WebSocket...");

  ws = new WebSocket(`ws://127.0.0.1:8080/?modelId=${MODEL_ID}`);

  ws.onopen = () => {
    console.log("🟢 WS conectado (Widget)");
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  ws.onmessage = (msg) => {
    console.log("📩 Mensaje recibido:", msg.data);
    const data = JSON.parse(msg.data);

    if (data.type === "tip") {
      handleTip(data.payload.name, Number(data.payload.amount));
    }

    if (data.type === "clear") {
      scores = {};
      updateUI();
    }
  };

  ws.onerror = () => ws.close();

  ws.onclose = () => {
    console.log("🔴 WS desconectado — reconectar en 2s...");
    reconnectTimer = setTimeout(connectWS, 2000);
  };
}

connectWS();

function handleTip(name, amount) {
  if (!scores[name]) scores[name] = 0;
  scores[name] += amount;
  updateUI();
}

function boomEffect(element) {
  element.style.animation = "boom .4s ease-out";
  setTimeout(() => element.style.animation = "", 400);
}

function updateUI() {
  const list = document.getElementById("top-list");
  list.innerHTML = "";

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const leader = sorted.length ? sorted[0][0] : null;

  sorted.forEach(([name, total], index) => {
    const div = document.createElement("div");
    div.className = "tip-item";
    div.setAttribute("data-name", name);

    const crown = index === 0 ? "👑" : "";
    div.innerHTML = `
      <span>${name} ${crown ? `<span class="crown">${crown}</span>` : ""}</span>
      <span>$${total}</span>
    `;

    list.appendChild(div);
  });

  if (leader && leader !== lastLeader) {
    const leaderEl = document.querySelector(`.tip-item[data-name="${leader}"]`);
    if (leaderEl) boomEffect(leaderEl);
  }

  lastLeader = leader;
}
