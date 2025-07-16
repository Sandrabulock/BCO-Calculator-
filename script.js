// Triggering service worker update
const pipeData = {
  CarbonSteel: {
    "3.0": { STD: 3.068, "40": 3.068, XS: 2.9, "80": 2.9 },
    "4.0": { STD: 4.026, "40": 4.026, XS: 3.826, "80": 3.826 },
    "6.0": { STD: 6.065, "40": 6.065, XS: 5.761, "80": 5.761 },
    "8.0": { STD: 7.981, "40": 7.981, XS: 7.625, "80": 7.625 },
    "10.0": { STD: 10.02, "40": 10.02, XS: 9.564, "80": 9.564 },
    "12.0": { STD: 11.938, "40": 11.938, XS: 11.314, "80": 11.314 },
    "14.0": { STD: 13.25, "40": 13.25, XS: 12.5, "80": 12.5 },
    "16.0": { STD: 15.25, "40": 15.25, XS: 14.688, "80": 14.688 },
    "18.0": { STD: 17.25, "40": 17.25, XS: 16.624, "80": 16.624 },
    "20.0": { STD: 19.25, "40": 19.25, XS: 18.624, "80": 18.624 },
    "24.0": { STD: 23.25, "40": 23.25, XS: 22.5, "80": 22.5 },
    "30.0": { STD: 29.25, "40": 29.25, XS: 28.5, "80": 28.5 },
    "36.0": { STD: 35.25, "40": 35.25, XS: 34.5, "80": 34.5 },
    "42.0": { STD: 41.25, "40": 41.25, XS: 40.5, "80": 40.5 },
    "48.0": { STD: 47.25, "40": 47.25, XS: 46.5, "80": 46.5 }
  },
  DuctileIron: {
    "3.0": { STD: 3.26 },
    "4.0": { STD: 4.04 },
    "6.0": { STD: 6.1 },
    "8.0": { STD: 8.28 },
    "10.0": { STD: 10.32 },
    "12.0": { STD: 12.38 },
    "14.0": { STD: 14.4 },
    "16.0": { STD: 16.5 },
    "18.0": { STD: 18.6 },
    "20.0": { STD: 20.7 },
    "24.0": { STD: 24.9 },
    "30.0": { STD: 31.0 },
    "36.0": { STD: 37.0 },
    "42.0": { STD: 43.2 },
    "48.0": { STD: 49.3 }
  }
};

const trueOD = {
  CarbonSteel: {
    "3.0": 3.5, "4.0": 4.5, "6.0": 6.625, "8.0": 8.625, "10.0": 10.75,
    "12.0": 12.75, "14.0": 14.0, "16.0": 16.0, "18.0": 18.0, "20.0": 20.0,
    "24.0": 24.0, "30.0": 30.0, "36.0": 36.0, "42.0": 42.0, "48.0": 48.0
  },
  DuctileIron: {
    "3.0": 3.96, "4.0": 4.8, "6.0": 6.9, "8.0": 9.05, "10.0": 11.1,
    "12.0": 13.2, "14.0": 15.3, "16.0": 17.4, "18.0": 19.5, "20.0": 21.6,
    "24.0": 25.8, "30.0": 32.0, "36.0": 38.3, "42.0": 44.5, "48.0": 50.8
  }
};

function populatePipeOD() {
  const material = document.getElementById("pipeMaterial").value;
  const odSelect = document.getElementById("pipeOD");
  odSelect.innerHTML = "";
  for (const size in pipeData[material]) {
    const label = `${size}" (${trueOD[material][size]} OD)`;
    const option = document.createElement("option");
    option.value = size;
    option.textContent = label;
    odSelect.appendChild(option);
  }
  updatePipeID();
}

function updatePipeID() {
  const material = document.getElementById("pipeMaterial").value;
  const od = document.getElementById("pipeOD").value;
  const schedule = document.getElementById("schedule").value;
  const pipe = pipeData[material]?.[od];
  const idInput = document.getElementById("pipeID");

  if (!pipe) {
    idInput.value = "";
    return;
  }

  if (pipe[schedule] !== undefined) {
    idInput.value = pipe[schedule];
  } else if (pipe.STD !== undefined) {
    idInput.value = pipe.STD;
  } else {
    idInput.value = "";
  }
}

function calculateBCO() {
  const pipeOD = parseFloat(document.getElementById("pipeOD").value);
  const pipeID = parseFloat(document.getElementById("pipeID").value);
  const cutterOD = parseFloat(document.getElementById("cutterOD").value);
  if (isNaN(pipeOD) || isNaN(pipeID) || isNaN(cutterOD)) return;

  const result = (pipeOD / 2) - Math.sqrt(Math.pow(pipeID / 2, 2) - Math.pow(cutterOD / 2, 2));
  document.getElementById("result").textContent = `BCO: ${result.toFixed(4)}`;
}

function toggleHistory() {
  const box = document.getElementById("historyBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

window.onload = function () {
  document.getElementById("pipeMaterial").addEventListener("change", populatePipeOD);
  document.getElementById("pipeOD").addEventListener("change", updatePipeID);
  document.getElementById("schedule").addEventListener("change", updatePipeID);
  populatePipeOD();
};

const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
} else {
  toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
