const MODEL_ID = "roman001";
ws = new WebSocket(`wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`);


let goal = 0;
let current = 0;

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
    current = 0;
    goal = 0;
    updateBar();
  }
};

function updateBar() {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  document.getElementById("goal-title").textContent =
    `Goal: $${current} / $${goal}`;

  document.getElementById("bar-fill").style.width = percentage + "%";
}
