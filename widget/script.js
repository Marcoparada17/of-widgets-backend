const MODEL_ID = "roman001";

let ws;
let reconnectTimer = null;
let scores = {};
let lastLeader = null;

function connectWS() {
  ws = new WebSocket(`wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`);

  ws.onopen = () => {
    console.log("🟢 Widget Xmas conectado");
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  ws.onmessage = (msg) => {
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
    console.log("🔴 Desconectado, reconectando...");
    reconnectTimer = setTimeout(connectWS, 2000);
  };
}

connectWS();

/* =========================
   SUMAR TIPS
========================= */
function handleTip(name, amount) {
  if (!scores[name]) scores[name] = 0;
  scores[name] += amount;
  updateUI();
}

/* =========================
   ANIMACIÓN BOOM
========================= */
function boomEffect(el) {
  el.classList.add("boom");
  setTimeout(() => el.classList.remove("boom"), 400);
}

/* =========================
   ACTUALIZAR UI NAVIDEÑA
========================= */
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

    let balls = "🔴🟢"; // bolas navideñas

    let badge = "";
    if (index === 0) {
      badge = ` <span class="crown">👑</span>
                <span class="snowman-mvp">⛄⛓️</span>`;
    }

    div.innerHTML = `
      <span>${balls} ${name} ${badge}</span>
      <span>$${total}</span>
    `;

    list.appendChild(div);
  });

  if (leader && leader !== lastLeader) {
    const items = document.querySelectorAll(".tip-item");
    if (items.length > 0) boomEffect(items[0]);
  }

  lastLeader = leader;
}
