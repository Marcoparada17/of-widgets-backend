const MODEL_ID = "roman001";

let ws;
let reconnectTimer = null;

let goal = 0;
let current = 0;

function connectWS() {
  ws = new WebSocket(`wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`);

  ws.onopen = () => {
    console.log("🟢 Goal WS conectado");
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  ws.onmessage = (msg) => {
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
      goal = 0;
      current = 0;
      updateBar();
    }
  };

  ws.onclose = () => {
    console.log("🔴 Goal WS desconectado, reconectando...");
    reconnectTimer = setTimeout(connectWS, 2000);
  };
}

connectWS();

function updateBar() {
  const bar = document.getElementById("bar-fill");
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  document.getElementById("goal-title").textContent =
    goal > 0 ? `🎯 Tribute Goal: $${current} / $${goal}` : "No Active Goal";

  bar.style.width = percentage + "%";

  bar.style.animation = "none";
  void bar.offsetWidth;
  bar.style.animation = "whip 0.4s ease-out";

  if (percentage === 100) {
    bar.style.animation =
      "whip 0.4s ease-out, pulseGlow 1s infinite alternate";
  }
}
