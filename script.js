function toKelvin(value, unit) {
  if (unit === 'c') return value + 273.15;
  if (unit === 'f') return (value - 32) * 5 / 9 + 273.15;
  return value;
}

function fromKelvin(k, unit) {
  if (unit === 'c') return k - 273.15;
  if (unit === 'f') return (k - 273.15) * 9 / 5 + 32;
  return k;
}

const valueEl = document.getElementById('value');
const fromEl = document.getElementById('from');
const toEl = document.getElementById('to');
const resultText = document.getElementById('resultText');
const meta = document.getElementById('meta');
const message = document.getElementById('message');
const historyEl = document.getElementById('history');

const convertBtn = document.getElementById('convert');
const clearBtn = document.getElementById('clear');
const swapBtn = document.getElementById('swap');
const copyBtn = document.getElementById('copy');
const downloadBtn = document.getElementById('download');
const round2Btn = document.getElementById('round2');
const round0Btn = document.getElementById('round0');

let history = [];
let lastResult = null;
function unitLabel(u) {
  return u === 'c' ? '°C' : u === 'f' ? '°F' : 'K';
}

function showMessage(text, cls = "") {
  message.textContent = text;
  message.className = cls;
}

function convert(round = 2) {

  if (valueEl.value.trim() === "") {
    showMessage("Please enter a temperature value", "error");
    resultText.textContent = "—";
    meta.textContent = "No conversion yet";
    return;
  }

  const val = Number(valueEl.value);

  if (isNaN(val)) {
    showMessage("Please enter a valid numeric value", "error");
    return;
  }

  const k = toKelvin(val, fromEl.value);
  if (k < 0) {
    showMessage("Temperature below absolute zero is not allowed", "error");
    return;
  }
  const out = fromKelvin(k, toEl.value);
  const final = out.toFixed(round);

  resultText.textContent = `${final} ${unitLabel(toEl.value)}`;
  meta.textContent = `${val} ${unitLabel(fromEl.value)} → ${unitLabel(toEl.value)}`;

  showMessage("Converted successfully ✔", "ok");

  lastResult = `${val} ${unitLabel(fromEl.value)} → ${final} ${unitLabel(toEl.value)}`;
  history.unshift(lastResult);
  history = history.slice(0, 20);
  renderHistory();
}

function renderHistory() {
  historyEl.innerHTML = "";

  if (history.length === 0) {
    historyEl.innerHTML = "<div>No conversions yet.</div>";
    return;
  }

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.textContent = item;
    div.onclick = () => navigator.clipboard.writeText(item);
    historyEl.appendChild(div);
  });
}

convertBtn.addEventListener("click", () => convert(2));
round2Btn.addEventListener("click", () => convert(2));
round0Btn.addEventListener("click", () => convert(0));

clearBtn.addEventListener("click", () => {
  valueEl.value = "";
  resultText.textContent = "—";
  meta.textContent = "No conversion yet";
  showMessage("");
});

swapBtn.addEventListener("click", () => {
  [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
  showMessage("Units swapped");
});

copyBtn.addEventListener("click", () => {
  if (!lastResult) {
    showMessage("No result to copy", "error");
    return;
  }
  navigator.clipboard.writeText(lastResult);
  showMessage("Result copied", "ok");
});

downloadBtn.addEventListener("click", () => {
  if (!lastResult) {
    showMessage("No result to download", "error");
    return;
  }

  const blob = new Blob([lastResult], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "temperature_result.txt";
  a.click();
  URL.revokeObjectURL(a.href);

  showMessage("Result downloaded", "ok");
});

valueEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") convert(2);
});
renderHistory();