const MODEL_ID = "roman001";
const SPIN_TIME = 9000;

const redNumbers = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];

// 📝 AQUÍ ESCRIBES LAS DINÁMICAS
const messages = {
  0: "Zona segura 🍀",
  1: "Baile sensual 💃",
  2: "Beso a cámara 😘",
  3: "Castigo leve 😈",
  4: "Shot 🍸",
  5: "Quita prenda 👙",
  6: "Modo caliente ON 🔥",
  7: "Susurro al mic 🎤",
  8: "Mirada intensa 👀",
  9: "Latigazo ⛓️",
  10: "Baile lento 🎶",
  11: "Premio doble 🎁",
  12: "JACKPOT 💎"
};

let ws;
let spinning = false;

const inner = document.getElementById("inner");
const mask = document.getElementById("mask");
const data = document.getElementById("data");
const resultNumber = document.getElementById("resultNumber");
const resultColor = document.getElementById("resultColor");
const history = document.getElementById("history");
const sound = document.getElementById("spinSound");

// =====================
// WEBSOCKET
// =====================
function connectWS() {
  ws = new WebSocket(
    `wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`
  );

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.type === "roulette") spin();
  };

  ws.onclose = () => setTimeout(connectWS, 2000);
}
connectWS();

// =====================
// SPIN
// =====================
function spin() {
  if (spinning) return;
  spinning = true;

  const number = Math.floor(Math.random() * 37);
  inner.setAttribute("data-spinto", number);

  mask.textContent = "No more bets";
  data.classList.remove("reveal");

  sound.currentTime = 0;
  sound.play().catch(() => {});

  setTimeout(() => {
    const color =
      number === 0 ? "green" :
      redNumbers.includes(number) ? "red" : "black";

    resultNumber.textContent = number;
    resultColor.textContent = color;
    data.classList.add("reveal");

    showMessage(number);
    addHistory(number, color);

    spinning = false;
  }, SPIN_TIME);
}

// =====================
// HISTORIAL
// =====================
function addHistory(num, color) {
  document.querySelector(".placeholder")?.remove();

  const li = document.createElement("li");
  li.className = `previous-result color-${color}`;
  li.innerHTML = `
    <span class="previous-number">${num}</span>
    <span class="previous-color">${color}</span>
  `;
  history.prepend(li);
}

// =====================
// MENSAJE
// =====================
function showMessage(num) {
  mask.textContent = messages[num] || "🔥 Acción 🔥";
}
