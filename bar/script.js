const MODEL_ID = "roman001";
const ws = new WebSocket(
  `wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`
);

let goal = 0;
let current = 0;

const bell = document.getElementById("bellSound");
const particlesLayer = document.querySelector(".particles");
const insideText = document.querySelector(".goal-inside-text");

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);

  if (data.type === "setGoal") {
    goal = Number(data.payload.goal);
    current = 0;
    insideText.textContent = "";
    updateBar(false);
  }

  if (data.type === "tip") {
    current += Number(data.payload.amount);
    updateBar(true);
  }

  if (data.type === "clearGoal") {
    goal = 0;
    current = 0;
    insideText.textContent = "";
    updateBar(false);
  }
};

function updateBar(playFx) {
  const percent = goal
    ? Math.min((current / goal) * 100, 100)
    : 0;

  document.getElementById("goal-title").textContent =
    `🎄 $${current} / $${goal} 🎄`;

  document.getElementById("bar-fill").style.width = percent + "%";

  // Mostrar texto SOLO cuando la goal está completa
  if (percent >= 100) {
    insideText.textContent = "Live Squirt";
  } else {
    insideText.textContent = "";
  }

  if (playFx) {
    bell.currentTime = 0;
    bell.play().catch(() => {});
    spawnParticles();
  }
}

function spawnParticles() {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = "70%";
    particlesLayer.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}
