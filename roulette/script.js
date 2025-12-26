const MODEL_ID = "roman001";
const SPIN_TIME = 9000;
const SECTORS = 13;
const DEG_PER_SECTOR = 360 / SECTORS;

const redNumbers = [1, 3, 5, 7, 9, 11];

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
let rotation = 0;

const plate = document.querySelector(".plate");
const mask = document.getElementById("mask");
const resultNumber = document.getElementById("resultNumber");
const resultColor = document.getElementById("resultColor");
const history = document.getElementById("history");
const sound = document.getElementById("spinSound");

// ===== WEBSOCKET =====
function connectWS() {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${protocol}://${location.host}?modelId=${MODEL_ID}`);

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "roulette") spin();
  };

  ws.onclose = () => setTimeout(connectWS, 2000);
}
connectWS();

// ===== SPIN =====
function spin() {
  if (spinning) return;
  spinning = true;

  const number = Math.floor(Math.random() * SECTORS);
  const spins = 6 * 360;

  const target =
    spins +
    (360 - number * DEG_PER_SECTOR - DEG_PER_SECTOR / 2);

  rotation += target;

  plate.style.transform = `rotate(${rotation}deg)`;

  mask.textContent = "No more bets";
  resultNumber.textContent = "";
  resultColor.textContent = "";

  sound.currentTime = 0;
  sound.play().catch(() => {});

  setTimeout(() => {
    const color =
      number === 0 ? "green" :
      redNumbers.includes(number) ? "red" : "black";

    resultNumber.textContent = number;
    resultColor.textContent = color;
    mask.textContent = messages[number];

    addHistory(number, color);
    spinning = false;
  }, SPIN_TIME);
}

// ===== HISTORIAL =====
function addHistory(num, color) {
  const li = document.createElement("li");
  li.className = `previous-result color-${color}`;
  li.innerHTML = `<strong>${num}</strong> <span>${color}</span>`;
  history.prepend(li);
}
