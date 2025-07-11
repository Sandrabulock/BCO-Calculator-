
// --- Unit conversion helpers ---
function cmToInches(cm) {
  return cm / 2.54;
}

function inchesToCM(inches) {
  return inches * 2.54;
}

// --- Handle theme toggle ---
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// --- Track previous unit to support conversion ---
let lastUnit = "inches";

// --- Update labels and input values when unit is changed ---
document.getElementById("units").addEventListener("change", () => {
  const newUnit = document.getElementById("units").value;
  const inputs = ["pipeOD", "pipeID", "cutterOD"];

  // Convert input values based on unit change
  inputs.forEach(id => {
    const el = document.getElementById(id);
    let val = parseFloat(el.value);
    if (isNaN(val)) return;

    el.value = (lastUnit === "inches" && newUnit === "cm")
      ? (val * 2.54).toFixed(4)
      : (lastUnit === "cm" && newUnit === "inches")
      ? (val / 2.54).toFixed(4)
      : val;
  });

  lastUnit = newUnit;
  updateLabels();
  updateResultUnit();
});

// --- Update input labels based on current unit ---
function updateLabels() {
  const unit = document.getElementById("units").value;
  const suffix = unit === "cm" ? " (cm)" : " (inches)";
  document.querySelector('label[for="pipeOD"]').innerText = "Pipe O.D." + suffix;
  document.querySelector('label[for="pipeID"]').innerText = "Pipe I.D." + suffix;
  document.querySelector('label[for="cutterOD"]').innerText = "Cutter O.D." + suffix;
}

// --- Copy result to clipboard ---
function setupCopyButton() {
  const btn = document.createElement("button");
  btn.textContent = "📋 Copy Result";
  btn.style.marginTop = "10px";
  btn.onclick = () => {
    const result = document.getElementById("result").innerText;
    if (result.includes("BCO")) {
      navigator.clipboard.writeText(result);
      btn.textContent = "✅ Copied!";
      setTimeout(() => (btn.textContent = "📋 Copy Result"), 1500);
    }
  };
  document.getElementById("result").insertAdjacentElement("afterend", btn);
}

// --- Calculate BCO with validation ---
function calculateBCO() {
  clearErrors();

  const unit = document.getElementById("units").value;
  const pipeODField = document.getElementById("pipeOD");
  const pipeIDField = document.getElementById("pipeID");
  const cutterODField = document.getElementById("cutterOD");

  let pipeOD = parseFloat(pipeODField.value);
  let pipeID = parseFloat(pipeIDField.value);
  let cutterOD = parseFloat(cutterODField.value);

  if (unit === "cm") {
    pipeOD = cmToInches(pipeOD);
    pipeID = cmToInches(pipeID);
    cutterOD = cmToInches(cutterOD);
  }

  let valid = true;
  if (isNaN(pipeOD)) { showError("pipeOD", "Enter a valid number."); valid = false; }
  if (isNaN(pipeID)) { showError("pipeID", "Enter a valid number."); valid = false; }
  if (isNaN(cutterOD)) { showError("cutterOD", "Enter a valid number."); valid = false; }
  if (valid && cutterOD >= pipeID) {
    showError("cutterOD", "Cutter O.D. must be smaller than Pipe I.D."); valid = false;
  }

  const resultEl = document.getElementById("result");
  if (!valid) {
    resultEl.innerText = "Fix the errors above to calculate.";
    return;
  }

  const bco = (pipeOD / 2) - Math.sqrt(Math.pow(pipeID / 2, 2) - Math.pow(cutterOD / 2, 2));
  const resultValue = unit === "cm" ? inchesToCM(bco) : bco;
  const unitLabel = unit === "cm" ? "cm" : "inches";
  const resultText = `BCO: ${resultValue.toFixed(4)} ${unitLabel}`;

  resultEl.innerText = resultText;

  // Save to history
  const entry = `Pipe O.D.: ${pipeODField.value}, Pipe I.D.: ${pipeIDField.value}, Cutter O.D.: ${cutterODField.value} → ${resultText}`;
  const history = JSON.parse(localStorage.getItem("bcoHistory") || "[]");
  history.unshift(entry);
  localStorage.setItem("bcoHistory", JSON.stringify(history));
  renderHistory();
}

// --- Show and clear input errors ---
function showError(id, msg) {
  const input = document.getElementById(id);
  input.classList.add("error");
  let err = input.nextElementSibling;
  if (!err || !err.classList.contains("error-text")) {
    err = document.createElement("div");
    err.className = "error-text";
    input.parentNode.insertBefore(err, input.nextSibling);
  }
  err.innerText = msg;
}

function clearErrors() {
  document.querySelectorAll("input").forEach(i => i.classList.remove("error"));
  document.querySelectorAll(".error-text").forEach(e => e.remove());
}

// --- Update result unit display if unit changed after calculating ---
function updateResultUnit() {
  const resultEl = document.getElementById("result");
  const unit = document.getElementById("units").value;
  if (!resultEl.innerText.includes("BCO")) return;

  const match = resultEl.innerText.match(/BCO: ([\d.]+) (inches|cm)/);
  if (!match) return;

  let value = parseFloat(match[1]);
  let fromUnit = match[2];
  if (fromUnit === unit) return;

  value = (unit === "cm") ? inchesToCM(value) : cmToInches(value);
  resultEl.innerText = `BCO: ${value.toFixed(4)} ${unit}`;
}

// --- History rendering and toggle ---
function renderHistory() {
  const history = JSON.parse(localStorage.getItem("bcoHistory") || "[]");
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("bcoHistory");
  renderHistory();
}

function toggleHistory() {
  const box = document.getElementById("historyBox");
  const btn = document.querySelector(".history-toggle button");
  const visible = box.style.display === "block";
  box.style.display = visible ? "none" : "block";
  btn.textContent = visible ? "Show History" : "Hide History";
}

// --- Initial setup ---
setupCopyButton();
updateLabels();
renderHistory();
