const MODEL_ID = "roman001";
const ws = new WebSocket(`wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`);

/* Crear nieve premium */
function createSnow() {
  const container = document.querySelector(".snow-layer");

  for (let i = 0; i < 40; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");

    // Tamaño random
    const size = Math.random() * 6 + 4;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;

    // Posición inicial horizontal
    flake.style.left = Math.random() * 100 + "%";

    // Duración caída
    flake.style.animationDuration = `${6 + Math.random() * 6}s`;

    // Delay inicial
    flake.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(flake);
  }
}

document.addEventListener("DOMContentLoaded", createSnow);


let goal = 0;
let current = 0;

const whipSound = document.getElementById("whipSound");

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);

  if (data.type === "setGoal") {
    goal = Number(data.payload.goal);
    current = 0;
    updateBar(true);
  }

  if (data.type === "tip") {
    current += Number(data.payload.amount);
    updateBar(true);
  }

  if (data.type === "clearGoal") {
    current = 0;
    goal = 0;
    updateBar(false);
  }
};

function updateBar(animate = false) {
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  document.getElementById("goal-title").textContent =
    `Goal: $${current} / $${goal}`;

  const bar = document.getElementById("bar-fill");
  bar.style.width = percent + "%";

  // 🔊 Látigo + estrellas cuando sube
  if (animate) {
    whipSound.currentTime = 0;
    whipSound.play().catch(() => {});
    
    bar.style.filter = "brightness(1.7)";
    setTimeout(() => bar.style.filter = "brightness(1)", 300);
  }
}
