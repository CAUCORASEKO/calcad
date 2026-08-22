let currentLang = "ES";
let currentModule = "loans";
let currentLoanTab = "constant";
let currentEquationTab = "linear";

const NAV_ITEMS = [
  ["loans", "navLoans"],
  ["contribution", "navContribution"],
  ["indexes", "navIndexes"],
  ["inflation", "navInflation"],
  ["probability", "navProbability"],
  ["equations", "navEquations"],
  ["trigonometry", "navTrigonometry"],
  ["exponential", "navExponential"],
];

function el(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function field(name, label, value = "") {
  return `
    <div class="field">
      <label for="${name}">${escapeHtml(label)}</label>
      <input
        id="${name}"
        name="${name}"
        type="text"
        inputmode="decimal"
        value="${escapeHtml(value)}"
        autocomplete="off"
      >
    </div>
  `;
}

function actionButtons(calculateHandler, exampleHandler, clearHandler) {
  return `
    <div class="actions">
      <button class="primary" onclick="${calculateHandler}">
        ${escapeHtml(tr(currentLang, "calculate"))}
      </button>

      <button class="primary" onclick="${exampleHandler}">
        ${escapeHtml(tr(currentLang, "example"))}
      </button>

      <button class="secondary" onclick="${clearHandler}">
        ${escapeHtml(tr(currentLang, "clear"))}
      </button>
    </div>
  `;
}

function resultArea(idPrefix) {
  return `
    <div class="card result-card">
      <h2>${escapeHtml(tr(currentLang, "result"))}</h2>
      <div id="${idPrefix}Result" class="result">—</div>
    </div>

    <div class="card">
      <h2>${escapeHtml(tr(currentLang, "steps"))}</h2>
      <pre id="${idPrefix}Steps" class="steps"></pre>
    </div>
  `;
}

function formulaCard(text) {
  if (currentLang === "EN") text = englishText(text);
  return `
    <div class="card formula-card">
      <h2>${escapeHtml(tr(currentLang, "formula"))}</h2>
      <div class="formula-text">${escapeHtml(text)}</div>
    </div>
  `;
}

function setCalculationOutput(prefix, output) {
  if (currentLang === "EN") output = englishOutput(output);
  el(`${prefix}Result`).textContent = output.result;
  el(`${prefix}Steps`).textContent = output.steps;
}

function setError(prefix) {
  el(`${prefix}Result`).textContent = tr(currentLang, "invalidInput");
  el(`${prefix}Steps`).textContent = "";
}

function clearFields(ids, prefix) {
  ids.forEach((id) => {
    const input = el(id);
    if (input) input.value = "";
  });

  if (prefix) {
    el(`${prefix}Result`).textContent = "—";
    el(`${prefix}Steps`).textContent = "";
  }
}

function renderNavigation() {
  const nav = el("nav");

  nav.innerHTML = NAV_ITEMS.map(([key, labelKey]) => `
    <button
      class="nav-button ${currentModule === key ? "active" : ""}"
      onclick="showModule('${key}')"
    >
      ${escapeHtml(tr(currentLang, labelKey))}
    </button>
  `).join("");
}

function updateGlobalLanguageUI() {
  document.documentElement.lang = currentLang === "FI" ? "fi" : currentLang === "EN" ? "en" : "es";
  el("languageLabel").textContent = tr(currentLang, "language");
  el("languageSelect").value = currentLang;
}

function showModule(moduleKey) {
  currentModule = moduleKey;
  renderNavigation();

  switch (moduleKey) {
    case "loans":
      renderLoans();
      break;
    case "contribution":
      renderContribution();
      break;
    case "indexes":
      renderIndexes();
      break;
    case "inflation":
      renderInflation();
      break;
    case "probability":
      renderProbability();
      break;
    case "equations":
      renderEquations();
      break;
    case "trigonometry":
      renderTrigonometry();
      break;
    case "exponential":
      renderExponential();
      break;
  }
}

function renderLoans() {
  el("moduleTitle").textContent = tr(currentLang, "navLoans");

  el("content").innerHTML = `
    <div class="tabs">
      <button
        class="tab-button ${currentLoanTab === "constant" ? "active" : ""}"
        onclick="showLoanTab('constant')"
      >
        ${escapeHtml(tr(currentLang, "constantLoan"))}
      </button>

      <button
        class="tab-button ${currentLoanTab === "annuity" ? "active" : ""}"
        onclick="showLoanTab('annuity')"
      >
        ${escapeHtml(tr(currentLang, "annuityLoan"))}
      </button>
    </div>

    <div id="loanTabContent"></div>
  `;

  renderLoanTabContent();
}

function showLoanTab(tab) {
  currentLoanTab = tab;
  renderLoans();
}

function renderLoanTabContent() {
  if (currentLoanTab === "constant") {
    const formula =
      currentLang === "FI"
        ? `Lyhennys = K / n
i = vuosikorko / 12 / 100
Saldo = K − lyhennys × (erä − 1)
Korko = saldo × i
Maksuerä = lyhennys + korko

K = lainapääoma
n = maksuerien kokonaismäärä
i = kuukausikorko
erä = laskettavan maksuerän numero`
        : currentLang === "EN"
        ? `Amortization = K / n
i = annual interest / 12 / 100
Balance = K − amortization × (installment − 1)
Interest = balance × i
Payment = amortization + interest

K = initial capital
n = total number of installments
i = monthly interest rate
installment = installment number to calculate`
        : `Amortización = K / n
i = interés anual / 12 / 100
Saldo = K − amortización × (cuota − 1)
Interés = saldo × i
Pago = amortización + interés

K = capital inicial
n = número total de cuotas
i = tasa de interés mensual
cuota = número de la cuota que queremos calcular`;

    el("loanTabContent").innerHTML = `
      ${formulaCard(formula)}

      <div class="card input-card">
        <div class="fields">
          ${field("loanCapital", tr(currentLang, "capital"))}
          ${field("loanMonths", tr(currentLang, "months"))}
          ${field("loanAnnualInterest", tr(currentLang, "annualInterest"))}
          ${field("loanInstallment", tr(currentLang, "installmentNumber"))}
        </div>

        ${actionButtons(
          "runConstantLoan()",
          "exampleConstantLoan()",
          "clearConstantLoan()"
        )}
      </div>

      ${resultArea("constantLoan")}
    `;
  } else {
    const formula =
      currentLang === "FI"
        ? `i = vuosikorko / 12 / 100
A = (K × i) / (1 − (1 + i)^(-n))

K = lainapääoma
i = kuukausikorko
n = maksuerien määrä
A = vakio maksuerä`
        : `i = interés anual / 12 / 100
A = (K × i) / (1 − (1 + i)^(-n))

K = capital inicial
i = tasa de interés mensual
n = número de cuotas
A = cuota fija`;

    el("loanTabContent").innerHTML = `
      ${formulaCard(formula)}

      <div class="card input-card">
        <div class="fields">
          ${field("annuityCapital", tr(currentLang, "capital"))}
          ${field("annuityMonths", tr(currentLang, "months"))}
          ${field("annuityAnnualInterest", tr(currentLang, "annualInterest"))}
        </div>

        ${actionButtons(
          "runAnnuityLoan()",
          "exampleAnnuityLoan()",
          "clearAnnuityLoan()"
        )}
      </div>

      ${resultArea("annuityLoan")}
    `;
  }
}

function runConstantLoan() {
  try {
    const output = calculateConstantLoan(
      {
        capital: el("loanCapital").value,
        months: el("loanMonths").value,
        annualInterest: el("loanAnnualInterest").value,
        installmentNumber: el("loanInstallment").value,
      },
      currentLang
    );

    setCalculationOutput("constantLoan", output);
  } catch {
    setError("constantLoan");
  }
}

function exampleConstantLoan() {
  el("loanCapital").value = "210000";
  el("loanMonths").value = "300";
  el("loanAnnualInterest").value = "5,3";
  el("loanInstallment").value = "12";
  runConstantLoan();
}

function clearConstantLoan() {
  clearFields(
    ["loanCapital", "loanMonths", "loanAnnualInterest", "loanInstallment"],
    "constantLoan"
  );
}

function runAnnuityLoan() {
  try {
    const output = calculateAnnuityLoan(
      {
        capital: el("annuityCapital").value,
        months: el("annuityMonths").value,
        annualInterest: el("annuityAnnualInterest").value,
      },
      currentLang
    );

    setCalculationOutput("annuityLoan", output);
  } catch {
    setError("annuityLoan");
  }
}

function exampleAnnuityLoan() {
  el("annuityCapital").value = "210000";
  el("annuityMonths").value = "300";
  el("annuityAnnualInterest").value = "5,3";
  runAnnuityLoan();
}

function clearAnnuityLoan() {
  clearFields(
    ["annuityCapital", "annuityMonths", "annuityAnnualInterest"],
    "annuityLoan"
  );
}

function renderContribution() {
  el("moduleTitle").textContent = tr(currentLang, "navContribution");

  const formula =
    currentLang === "FI"
      ? `Kate = myyntituotot − muuttuvat kustannukset
Tulos = kate − kiinteät kustannukset
Kateprosentti = kate / myyntituotot × 100`
      : currentLang === "EN"
      ? `Margin = sales revenue − variable costs
Result = margin − fixed costs
Margin % = margin / sales revenue × 100`
      : `Margen = ingresos por ventas − costes variables
Resultado = margen − costes fijos
Margen % = margen / ingresos por ventas × 100`;

  el("content").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("sales", tr(currentLang, "sales"))}
        ${field("variableCosts", tr(currentLang, "variableCosts"))}
        ${field("fixedCosts", tr(currentLang, "fixedCosts"))}
      </div>

      ${actionButtons(
        "runContribution()",
        "exampleContribution()",
        "clearContribution()"
      )}
    </div>

    ${resultArea("contribution")}
  `;
}

function runContribution() {
  try {
    const output = calculateContribution(
      {
        sales: el("sales").value,
        variableCosts: el("variableCosts").value,
        fixedCosts: el("fixedCosts").value,
      },
      currentLang
    );

    setCalculationOutput("contribution", output);
  } catch {
    setError("contribution");
  }
}

function exampleContribution() {
  el("sales").value = "12000";
  el("variableCosts").value = "7200";
  el("fixedCosts").value = "3000";
  runContribution();
}

function clearContribution() {
  clearFields(
    ["sales", "variableCosts", "fixedCosts"],
    "contribution"
  );
}

function renderIndexes() {
  el("moduleTitle").textContent = tr(currentLang, "navIndexes");

  const formula =
    currentLang === "FI"
      ? "Muutos % = (uusi arvo − vanha arvo) / vanha arvo × 100"
      : "Cambio % = (valor nuevo − valor antiguo) / valor antiguo × 100";

  el("content").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("oldValue", tr(currentLang, "oldValue"))}
        ${field("newValue", tr(currentLang, "newValue"))}
      </div>

      ${actionButtons(
        "runIndex()",
        "exampleIndex()",
        "clearIndex()"
      )}
    </div>

    ${resultArea("index")}
  `;
}

function runIndex() {
  try {
    const output = calculateIndex(
      {
        oldValue: el("oldValue").value,
        newValue: el("newValue").value,
      },
      currentLang
    );

    setCalculationOutput("index", output);
  } catch {
    setError("index");
  }
}

function exampleIndex() {
  el("oldValue").value = "100";
  el("newValue").value = "120";
  runIndex();
}

function clearIndex() {
  clearFields(["oldValue", "newValue"], "index");
}

function renderInflation() {
  el("moduleTitle").textContent = tr(currentLang, "navInflation");

  const formula =
    currentLang === "FI"
      ? `Hintojen nousu % = (KHI2 / KHI1 × 100) − 100
q = (KHI2 / KHI1)^(1/n)
Vuotuinen inflaatio % = (q − 1) × 100`
      : currentLang === "EN"
      ? `Total inflation % = (CPI2 / CPI1 × 100) − 100
q = (CPI2 / CPI1)^(1/n)
Annual inflation % = (q − 1) × 100`
      : `Inflación total % = (IPC2 / IPC1 × 100) − 100
q = (IPC2 / IPC1)^(1/n)
Inflación anual % = (q − 1) × 100`;

  el("content").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("cpiInitial", tr(currentLang, "cpiInitial"))}
        ${field("cpiFinal", tr(currentLang, "cpiFinal"))}
        ${field("years", tr(currentLang, "years"))}
      </div>

      ${actionButtons(
        "runInflation()",
        "exampleInflation()",
        "clearInflation()"
      )}
    </div>

    ${resultArea("inflation")}
  `;
}

function runInflation() {
  try {
    const output = calculateInflation(
      {
        cpiInitial: el("cpiInitial").value,
        cpiFinal: el("cpiFinal").value,
        years: el("years").value,
      },
      currentLang
    );

    setCalculationOutput("inflation", output);
  } catch {
    setError("inflation");
  }
}

function exampleInflation() {
  el("cpiInitial").value = "100";
  el("cpiFinal").value = "112";
  el("years").value = "3";
  runInflation();
}

function clearInflation() {
  clearFields(["cpiInitial", "cpiFinal", "years"], "inflation");
}

function renderProbability() {
  el("moduleTitle").textContent = tr(currentLang, "navProbability");

  const formula =
    currentLang === "FI"
      ? "P = suotuisat tapaukset / kaikki mahdolliset tapaukset"
      : "P = casos favorables / casos totales";

  el("content").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("favorableCases", tr(currentLang, "favorableCases"))}
        ${field("totalCases", tr(currentLang, "totalCases"))}
      </div>

      ${actionButtons(
        "runProbability()",
        "exampleProbability()",
        "clearProbability()"
      )}
    </div>

    ${resultArea("probability")}
  `;
}

function runProbability() {
  try {
    const output = calculateProbability(
      {
        favorableCases: el("favorableCases").value,
        totalCases: el("totalCases").value,
      },
      currentLang
    );

    setCalculationOutput("probability", output);
  } catch {
    setError("probability");
  }
}

function exampleProbability() {
  el("favorableCases").value = "3";
  el("totalCases").value = "10";
  runProbability();
}

function clearProbability() {
  clearFields(
    ["favorableCases", "totalCases"],
    "probability"
  );
}

function renderEquations() {
  el("moduleTitle").textContent = tr(currentLang, "navEquations");

  el("content").innerHTML = `
    <div class="tabs">
      <button
        class="tab-button ${currentEquationTab === "linear" ? "active" : ""}"
        onclick="showEquationTab('linear')"
      >
        ${escapeHtml(tr(currentLang, "linearEquation"))}
      </button>

      <button
        class="tab-button ${currentEquationTab === "quadratic" ? "active" : ""}"
        onclick="showEquationTab('quadratic')"
      >
        ${escapeHtml(tr(currentLang, "quadraticEquation"))}
      </button>
    </div>

    <div id="equationTabContent"></div>
  `;

  renderEquationTabContent();
}

function showEquationTab(tab) {
  currentEquationTab = tab;
  renderEquations();
}

function renderEquationTabContent() {
  if (currentEquationTab === "linear") {
    const formula =
      currentLang === "FI"
        ? `ax + b = c
x = (c − b) / a

a = x:n kerroin
b = vakio
c = oikean puolen arvo
x = ratkaistava tuntematon`
        : `ax + b = c
x = (c − b) / a

a = coeficiente de x
b = término constante
c = valor del lado derecho
x = incógnita`;

    el("equationTabContent").innerHTML = `
      ${formulaCard(formula)}

      <div class="card input-card">
        <div class="fields">
          ${field("linearA", "a")}
          ${field("linearB", "b")}
          ${field("linearC", "c")}
        </div>

        ${actionButtons(
          "runLinearEquation()",
          "exampleLinearEquation()",
          "clearLinearEquation()"
        )}
      </div>

      ${resultArea("linearEquation")}
    `;
  } else {
    const formula =
      currentLang === "FI"
        ? `ax² + bx + c = 0
D = b² − 4ac
x = (−b ± √D) / (2a)

D = diskriminantti`
        : `ax² + bx + c = 0
D = b² − 4ac
x = (−b ± √D) / (2a)

D = discriminante`;

    el("equationTabContent").innerHTML = `
      ${formulaCard(formula)}

      <div class="card input-card">
        <div class="fields">
          ${field("quadraticA", "a")}
          ${field("quadraticB", "b")}
          ${field("quadraticC", "c")}
        </div>

        ${actionButtons(
          "runQuadraticEquation()",
          "exampleQuadraticEquation()",
          "clearQuadraticEquation()"
        )}
      </div>

      ${resultArea("quadraticEquation")}
    `;
  }
}

function runLinearEquation() {
  try {
    const output = calculateLinearEquation(
      {
        a: el("linearA").value,
        b: el("linearB").value,
        c: el("linearC").value,
      },
      currentLang
    );

    setCalculationOutput("linearEquation", output);
  } catch {
    setError("linearEquation");
  }
}

function exampleLinearEquation() {
  el("linearA").value = "2";
  el("linearB").value = "5";
  el("linearC").value = "17";
  runLinearEquation();
}

function clearLinearEquation() {
  clearFields(
    ["linearA", "linearB", "linearC"],
    "linearEquation"
  );
}

function runQuadraticEquation() {
  try {
    const output = calculateQuadraticEquation(
      {
        a: el("quadraticA").value,
        b: el("quadraticB").value,
        c: el("quadraticC").value,
      },
      currentLang
    );

    setCalculationOutput("quadraticEquation", output);
  } catch {
    setError("quadraticEquation");
  }
}

function exampleQuadraticEquation() {
  el("quadraticA").value = "1";
  el("quadraticB").value = "-5";
  el("quadraticC").value = "6";
  runQuadraticEquation();
}

function clearQuadraticEquation() {
  clearFields(
    ["quadraticA", "quadraticB", "quadraticC"],
    "quadraticEquation"
  );
}

function renderTrigonometry() {
  el("moduleTitle").textContent = tr(currentLang, "navTrigonometry");

  const formula =
    currentLang === "FI"
      ? `tan A = vastakkainen kateetti / viereinen kateetti
A = arctan(vastakkainen / viereinen)`
      : `tan A = cateto opuesto / cateto adyacente
A = arctan(opuesto / adyacente)`;

  el("content").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("opposite", tr(currentLang, "opposite"))}
        ${field("adjacent", tr(currentLang, "adjacent"))}
      </div>

      ${actionButtons(
        "runTrigonometry()",
        "exampleTrigonometry()",
        "clearTrigonometry()"
      )}
    </div>

    ${resultArea("trigonometry")}
  `;
}

function runTrigonometry() {
  try {
    const output = calculateTrigonometry(
      {
        opposite: el("opposite").value,
        adjacent: el("adjacent").value,
      },
      currentLang
    );

    setCalculationOutput("trigonometry", output);
  } catch {
    setError("trigonometry");
  }
}

function exampleTrigonometry() {
  el("opposite").value = "3";
  el("adjacent").value = "4";
  runTrigonometry();
}

function clearTrigonometry() {
  clearFields(["opposite", "adjacent"], "trigonometry");
}

function renderExponential() {
  el("moduleTitle").textContent = tr(currentLang, "navExponential");

  const formula =
    currentLang === "FI"
      ? `f(t) = k · a^t

k = alkuarvo
a = kasvu- tai vähenemiskerroin
t = aika`
      : `f(t) = k · a^t

k = valor inicial
a = factor de crecimiento o decrecimiento
t = tiempo`;

  el("content").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("initialValue", tr(currentLang, "initialValue"))}
        ${field("factor", tr(currentLang, "factor"))}
        ${field("time", tr(currentLang, "time"))}
      </div>

      ${actionButtons(
        "runExponential()",
        "exampleExponential()",
        "clearExponential()"
      )}
    </div>

    ${resultArea("exponential")}
  `;
}

function runExponential() {
  try {
    const output = calculateExponential(
      {
        initialValue: el("initialValue").value,
        factor: el("factor").value,
        time: el("time").value,
      },
      currentLang
    );

    setCalculationOutput("exponential", output);
  } catch {
    setError("exponential");
  }
}

function exampleExponential() {
  el("initialValue").value = "1000";
  el("factor").value = "1,05";
  el("time").value = "3";
  runExponential();
}

function clearExponential() {
  clearFields(
    ["initialValue", "factor", "time"],
    "exponential"
  );
}

function changeLanguage(lang) {
  currentLang = lang;
  updateGlobalLanguageUI();
  renderNavigation();
  showModule(currentModule);
}

document.addEventListener("DOMContentLoaded", () => {
  updateGlobalLanguageUI();

  el("languageSelect").addEventListener("change", (event) => {
    changeLanguage(event.target.value);
  });

  renderNavigation();
  showModule("loans");
});
