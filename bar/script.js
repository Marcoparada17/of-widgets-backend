const MODEL_ID = "roman001";

let ws;
let reconnectTimer = null;

let goal = 0;
let current = 0;

function connectWS() {
  console.log("🔌 Conectando WS (Goal Bar)");

  ws = new WebSocket(
    `wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`
  );

  ws.onopen = () => {
    console.log("🟢 WS conectado (Goal Bar)");
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  ws.onmessage = (msg) => {
    console.log("📩 Mensaje recibido (Goal):", msg.data);
    const data = JSON.parse(msg.data);

    if (data.type === "setGoal") {
      goal = Number(data.payload.goal);
      current = 0;
      updateBar();
    }

    if (data.type === "tip") {
      current += Number(data.payload.amount);
      updateBar();
    }

    if (data.type === "clearGoal") {
      current = 0;
      goal = 0;
      updateBar();
    }
  };

  ws.onerror = () => ws.close();

  ws.onclose = () => {
    console.log("🔴 WS desconectado — reconectar en 2s...");
    reconnectTimer = setTimeout(connectWS, 2000);
  };
}

connectWS();

// =========================
// 🔥 WHIP EFFECT ANIMATION
// =========================
function whipAnimation() {
  const bar = document.getElementById("bar-fill");

  bar.style.animation = "none"; // reset
  void bar.offsetWidth;         // reflow hack
  bar.style.animation = "whip 0.45s ease-out";
}

function updateBar() {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  // 🩸 Dominatrix Style Title
  document.getElementById("goal-title").textContent =
    goal > 0 ? `🎯 Tribute Goal: $${current} / $${goal}` : "No Active Goal";

  // actualizar barra
  const bar = document.getElementById("bar-fill");
  bar.style.width = percentage + "%";

  // aplicar efecto látigo
  whipAnimation();

  // 💥 vibración sutil cuando llega al 100%
  if (percentage === 100) {
    bar.style.animation =
      "whip 0.4s ease-out, pulseGlow 1s infinite alternate";
  }
}
