const MODEL_ID = "roman001";

let ws;
let spinning = false;
let currentRotation = 0;

const numbers = [0,1,2,3,4,5,6,7,8,9,10,11,12];

// dinámicas editables
const dynamics = {
  0: "Zona segura 🍀",
  1: "Baile sexy 💃",
  2: "Gemido 🔥",
  3: "Castigo leve 😈",
  4: "Shot 🍸",
  5: "Quita prenda 👙",
  6: "Modo caliente ON 😏",
  7: "Susurro 🎤",
  8: "Mirada intensa 👀",
  9: "Latigazo ⛓️",
  10: "Baile lento 🎶",
  11: "Premio doble 🎁",
  12: "JACKPOT 💎"
};

const container = document.getElementById("numbers");

// crear números
numbers.forEach((num, i) => {
  const angle = (360 / numbers.length) * i;
  const el = document.createElement("div");

  el.className = "number";
  el.textContent = num;

  if (num === 0) el.classList.add("green");
  else el.classList.add(i % 2 === 0 ? "black" : "green");

  el.style.transform = `rotate(${angle}deg) translate(0, -140px)`;
  container.appendChild(el);
});

// WS
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

// GIRO REAL
function spin() {
  if (spinning) return;
  spinning = true;

  const sound = document.getElementById("spinSound");
  sound.currentTime = 0;
  sound.play().catch(()=>{});

  const index = Math.floor(Math.random() * numbers.length);
  const anglePer = 360 / numbers.length;

  const fullSpins = 6 * 360;
  const stopAngle = 360 - index * anglePer;
  currentRotation += fullSpins + stopAngle;

  container.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    showResult(numbers[index]);
    spinning = false;
  }, 6200); // 🔥 MISMA DURACIÓN QUE EL AUDIO
}

function showResult(num) {
  const toast = document.getElementById("toast");
  toast.textContent = `🎰 ${num} — ${dynamics[num]}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 5000);
}
