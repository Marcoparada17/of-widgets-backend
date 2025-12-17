const MODEL_ID = "roman001";
const ws = new WebSocket(
  `wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`
);

let goal = 0;
let current = 0;

const bar = document.getElementById("bar-fill");
const goalText = document.querySelector(".goal-text");
const bell = document.getElementById("bellSound");

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);

  if (data.type === "setGoal") {
    goal = Number(data.payload.goal);
    current = 0;
    updateBar(false);
  }

  if (data.type === "tip") {
    current += Number(data.payload.amount);
    updateBar(true);
  }

  if (data.type === "clearGoal") {
    goal = 0;
    current = 0;
    updateBar(false);
  }
};

function updateBar(playFx) {
  const percent = goal
    ? Math.min((current / goal) * 100, 100)
    : 0;

  // ancho de la barra
  bar.style.width = percent + "%";

  // TEXTO QUE SIEMPRE SE VE
  if (goal > 0) {
    goalText.textContent = `$${current} / $${goal}`;
  } else {
    goalText.textContent = "";
  }

  // neón SOLO al completar
  if (percent >= 100) {
    goalText.classList.add("neon");
  } else {
    goalText.classList.remove("neon");
  }

  if (playFx) {
    bell.currentTime = 0;
    bell.play().catch(() => {});
  }
}
