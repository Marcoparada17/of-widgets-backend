const MODEL_ID = "roman001";

let ws;
let spinning = false;

// Mensajes dinámicos por número (edítalos a tu gusto)
const messages = {
  1: "Baila para mí 💃",
  2: "Un beso a cámara 😘",
  3: "Castigo leve 😈",
  4: "Shot 🍸",
  5: "Quita una prenda 👙",
  6: "Gemido suave 🔥",
  7: "10 sentadillas 🏋️",
  8: "Baile lento 🎶",
  9: "Modo sexy ON 💋",
  10: "Latigazo simbólico ⛓️",
  11: "Susurro al mic 🎤",
  12: "Premio doble 🎁",
  13: "JACKPOT 💎"
};

// =========================
// WEBSOCKET
// =========================
function connectWS() {
  ws = new WebSocket(
    `wss://of-widgets-backend-production.up.railway.app/?modelId=${MODEL_ID}`
  );

  ws.onopen = () => console.log("🟢 Ruleta conectada");

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    // 🎰 EVENTO DESDE EL PANEL
    if (data.type === "roulette") {
      spinRoulette();
    }
  };

  ws.onclose = () => {
    console.log("🔴 Ruleta desconectada, reconectando...");
    setTimeout(connectWS, 2000);
  };
}

connectWS();

// =========================
// SPIN LOGIC
// =========================
function spinRoulette() {
  if (spinning) return;
  spinning = true;

  const glow = document.getElementById("spinner-glow");
  const toast = document.getElementById("toast");
  const slots = document.querySelectorAll(".slot");

  // reset visual
  slots.forEach(s => s.style.color = "#fff");
  toast.classList.remove("show");

  // acelerar glow
  glow.style.animationDuration = "0.12s";

  // número random
  const result = Math.floor(Math.random() * 13) + 1;

  // duración del giro
  setTimeout(() => {
    // detener glow
    glow.style.animationDuration = "1s";

    // resaltar número
    slots[result - 1].style.color = "gold";
    slots[result - 1].style.textShadow = "0 0 12px gold";

    // toast
    toast.textContent = `🎰 ${result} → ${messages[result]}`;
    toast.classList.add("show");

    // liberar spin
    spinning = false;
  }, 2600);
}
