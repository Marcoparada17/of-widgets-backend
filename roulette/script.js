const MODEL_ID = "roman001";

let ws;
let spinning = false;
let currentRotation = 0;

// 🎯 NÚMEROS
const numbers = [0,1,2,3,4,5,6,7,8,9,10,11,12];

// 📝 MENSAJES EDITABLES (AQUÍ ESCRIBES TÚ)
const messages = {
  0: "Zona segura 🍀",
  1: "Baile sensual 💃",
  2: "Beso a la cámara 😘",
  3: "Castigo leve 😈",
  4: "Shot 🍸",
  5: "Quita una prenda 👙",
  6: "Modo caliente ON 🔥",
  7: "Susurro al mic 🎤",
  8: "Mirada intensa 👀",
  9: "Latigazo simbólico ⛓️",
  10: "Baile lento 🎶",
  11: "Premio doble 🎁",
  12: "JACKPOT 💎"
};

// =======================
// CREAR SECTORES
// =======================
const container = document.getElementById("sectors");
numbers.forEach((num, i) => {
  const angle = (360 / numbers.length) * i;

  const sector = document.createElement("div");
  sector.className = "sector " + (i % 2 === 0 ? "green" : "red");
  sector.style.transform = `rotate(${angle}deg)`;

  const label = document.createElement("span");
  label.textContent = num;

  // contraste
  label.style.color = i % 2 === 0 ? "#fff" : "#000";

  sector.appendChild(label);
  container.appendChild(sector);
});

// =======================
// WEBSOCKET
// =======================
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

// =======================
// SPIN
// =======================
function spin() {
  if (spinning) return;
  spinning = true;

  const sound = document.getElementById("spinSound");
  const toast = document.getElementById("toast");

  toast.classList.remove("show");

  sound.currentTime = 0;
  sound.play().catch(()=>{});

  const index = Math.floor(Math.random() * numbers.length);
  const anglePer = 360 / numbers.length;

  const fullSpins = 6 * 360;
  const stopAngle = 360 - index * anglePer;
  currentRotation += fullSpins + stopAngle;

  container.style.transform = `rotate(${currentRotation}deg)`;

  // ⏱ MISMO TIEMPO QUE EL AUDIO
  setTimeout(() => {
    const result = numbers[index];
    showToast(result);
    spinning = false;
  }, 6200);
}

// =======================
// TOAST
// =======================
function showToast(num) {
  const toast = document.getElementById("toast");
  toast.textContent = `🎰 ${num} → ${messages[num] || "Sin dinámica"}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}
