const MODEL_ID = "roman001";
const ws = new WebSocket(
  `wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`
);

let scores = {};
let lastLeader = null;

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);

  if (data.type === "tip") {
    const { name, amount } = data.payload;
    scores[name] = (scores[name] || 0) + Number(amount);
    render();
  }

  if (data.type === "clear") {
    scores = {};
    lastLeader = null;
    render();
  }
};

function render() {
  const list = document.getElementById("top-list");
  list.innerHTML = "";

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const leader = sorted[0]?.[0];

  sorted.forEach(([name, total], i) => {
    const div = document.createElement("div");
    div.className = "tip" + (i === 0 ? " mvp" : "");

    const deco = i === 0 ? " 👑" : " ❄️";
    div.innerHTML = `
      <span class="left">${name}<span class="deco">${deco}</span></span>
      <span class="right">$${total}</span>
    `;

    list.appendChild(div);
  });

  // Animación solo si cambia el MVP
  if (leader && leader !== lastLeader) {
    const mvp = document.querySelector(".tip.mvp");
    if (mvp) {
      mvp.classList.remove("pop");
      void mvp.offsetWidth;
      mvp.classList.add("pop");
    }
  }

  lastLeader = leader;
}
