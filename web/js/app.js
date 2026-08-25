let currentLang = "ES";
let currentModule = "loans";
let currentLoanTab = "constant";
let currentEquationTab = "linear";
let currentContributionTab = "direct";
let currentIndexTab = "change";
let currentExponentialTab = "standard";

const NAV_ITEMS = [
  ["loans", "navLoans"],
  ["contribution", "navContribution"],
  ["indexes", "navIndexes"],
  ["inflation", "navInflation"],
  ["probability", "navProbability"],
  ["equations", "navEquations"],
  ["trigonometry", "navTrigonometry"],
  ["exponential", "navExponential"],
  ["vat", "navVat"],
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

      <button class="secondary" onclick="${exampleHandler}">
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
    case "vat":
      renderVat();
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
Korko = jäljellä oleva pääoma × i
Maksuerä = lyhennys + korko`
        : currentLang === "EN"
        ? `Amortization = K / n
i = annual interest / 12 / 100
Interest = outstanding balance × i
Payment = amortization + interest`
        : `Amortización = K / n
i = interés anual / 12 / 100
Interés = saldo pendiente × i
Pago = amortización + interés`;

    el("loanTabContent").innerHTML = `
      ${formulaCard(formula)}

      <div class="card input-card">
        <div class="fields">
          ${field("loanCapital", tr(currentLang, "capital"))}
          ${field("loanMonths", tr(currentLang, "months"))}
          ${field("loanAnnualInterest", tr(currentLang, "annualInterest"))}
          ${field("loanInstallment", tr(currentLang, "installmentNumber"), "1")}
        </div>

        ${actionButtons(
          "runConstantLoan()",
          "exampleConstantLoan()",
          "clearConstantLoan()"
        )}
      </div>

      ${resultArea("constantLoan")}
    `;
    return;
  }

  const formula =
    currentLang === "FI"
      ? `i = vuosikorko / 12 / 100
A = (K × i) / (1 − (1 + i)^(-n))`
      : currentLang === "EN"
      ? `i = annual interest / 12 / 100
A = (K × i) / (1 − (1 + i)^(-n))`
      : `i = interés anual / 12 / 100
A = (K × i) / (1 − (1 + i)^(-n))`;

  el("loanTabContent").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("annuityCapital", tr(currentLang, "capital"))}
        ${field("annuityMonths", tr(currentLang, "months"))}
        ${field("annuityAnnualInterest", tr(currentLang, "annualInterest"))}
        ${field("annuityInstallment", tr(currentLang, "installmentNumber"), "1")}
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


function runConstantLoan() {
  try {
    const details = calculateLoanSchedule({
      capital: el("loanCapital").value,
      months: el("loanMonths").value,
      annualInterest: el("loanAnnualInterest").value,
      installment: el("loanInstallment").value,
    });

    const L =
      currentLang === "FI"
        ? {
            monthly: "Kuukausittainen lyhennys",
            totalInterest: "Korot yhteensä",
            totalPaid: "Maksetaan yhteensä",
            first: "Ensimmäinen erä",
            second: "Toinen erä",
            selected: "Valittu erä",
            last: "Viimeinen erä",
            opening: "Alkusaldo",
            amort: "Lyhennys",
            interest: "Korko",
            payment: "Maksu",
            remaining: "Jäljellä",
          }
        : currentLang === "EN"
        ? {
            monthly: "Monthly amortization",
            totalInterest: "Total interest",
            totalPaid: "Total paid",
            first: "First installment",
            second: "Second installment",
            selected: "Selected installment",
            last: "Last installment",
            opening: "Opening balance",
            amort: "Amortization",
            interest: "Interest",
            payment: "Payment",
            remaining: "Remaining balance",
          }
        : {
            monthly: "Amortización mensual",
            totalInterest: "Intereses totales",
            totalPaid: "Total pagado",
            first: "Primera cuota",
            second: "Segunda cuota",
            selected: "Cuota seleccionada",
            last: "Última cuota",
            opening: "Saldo inicial",
            amort: "Amortización",
            interest: "Interés",
            payment: "Pago",
            remaining: "Saldo restante",
          };

    const monthly = details.first.amortization;

    const uniqueRows = [];
    const candidates = [
      [L.first, details.first],
      [L.second, details.second],
      [L.selected, details.selected],
      [L.last, details.last],
    ];

    const seen = new Set();

    for (const [label, row] of candidates) {
      if (!row || seen.has(row.number)) continue;
      seen.add(row.number);
      uniqueRows.push(
        `${label} #${row.number}\n` +
        `${L.opening}: ${formatMoney(row.opening)} €\n` +
        `${L.amort}: ${formatMoney(row.amortization)} €\n` +
        `${L.interest}: ${formatMoney(row.interest)} €\n` +
        `${L.payment}: ${formatMoney(row.payment)} €\n` +
        `${L.remaining}: ${formatMoney(row.remaining)} €`
      );
    }

    setCalculationOutput("constantLoan", {
      result: `${L.monthly}: ${formatMoney(monthly)} €`,
      steps:
        `${L.totalInterest}: ${formatMoney(details.totalInterest)} €\n` +
        `${L.totalPaid}: ${formatMoney(details.totalPaid)} €\n\n` +
        uniqueRows.join("\n\n"),
    });
  } catch {
    setError("constantLoan");
  }
}


function exampleConstantLoan() {
  el("loanCapital").value = "210000";
  el("loanMonths").value = "300";
  el("loanAnnualInterest").value = "1,26";
  el("loanInstallment").value = "1";
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
    const details = calculateAnnuityDetails({
      capital: el("annuityCapital").value,
      months: el("annuityMonths").value,
      annualInterest: el("annuityAnnualInterest").value,
      installment: el("annuityInstallment").value,
    });

    const L =
      currentLang === "FI"
        ? {
            payment: "Kuukausierä",
            totalInterest: "Korot yhteensä",
            totalPaid: "Maksetaan yhteensä",
            selected: "Valittu erä",
            opening: "Alkusaldo",
            principal: "Lyhennys",
            interest: "Korko",
            remaining: "Jäljellä",
          }
        : currentLang === "EN"
        ? {
            payment: "Monthly payment",
            totalInterest: "Total interest",
            totalPaid: "Total paid",
            selected: "Selected installment",
            opening: "Opening balance",
            principal: "Principal",
            interest: "Interest",
            remaining: "Remaining balance",
          }
        : {
            payment: "Cuota mensual",
            totalInterest: "Intereses totales",
            totalPaid: "Total pagado",
            selected: "Cuota seleccionada",
            opening: "Saldo inicial",
            principal: "Amortización",
            interest: "Interés",
            remaining: "Saldo restante",
          };

    const row = details.selected;

    setCalculationOutput("annuityLoan", {
      result: `${L.payment}: ${formatMoney(details.payment)} €`,
      steps:
        `${L.totalPaid}: ${formatMoney(details.totalPaid)} €\n` +
        `${L.totalInterest}: ${formatMoney(details.totalInterest)} €\n\n` +
        `${L.selected} #${row.number}\n` +
        `${L.opening}: ${formatMoney(row.opening)} €\n` +
        `${L.interest}: ${formatMoney(row.interest)} €\n` +
        `${L.principal}: ${formatMoney(row.principal)} €\n` +
        `${L.payment}: ${formatMoney(row.payment)} €\n` +
        `${L.remaining}: ${formatMoney(row.remaining)} €`,
    });
  } catch {
    setError("annuityLoan");
  }
}


function exampleAnnuityLoan() {
  el("annuityCapital").value = "20000";
  el("annuityMonths").value = "60";
  el("annuityAnnualInterest").value = "6";
  el("annuityInstallment").value = "1";
  runAnnuityLoan();
}


function clearAnnuityLoan() {
  clearFields(
    [
      "annuityCapital",
      "annuityMonths",
      "annuityAnnualInterest",
      "annuityInstallment",
    ],
    "annuityLoan"
  );
}


function renderContribution() {
  el("moduleTitle").textContent = tr(currentLang, "navContribution");

  const tabs = `
    <div class="tabs">
      <button
        class="tab-button ${currentContributionTab === "direct" ? "active" : ""}"
        onclick="currentContributionTab='direct';renderContribution()"
      >
        ${tr(currentLang, "directValues")}
      </button>

      <button
        class="tab-button ${currentContributionTab === "unit" ? "active" : ""}"
        onclick="currentContributionTab='unit';renderContribution()"
      >
        ${tr(currentLang, "unitEconomics")}
      </button>
    </div>
  `;

  if (currentContributionTab === "unit") {
    el("content").innerHTML = `
      ${tabs}
      ${formulaCard(
        "sales = quantity × selling price\n" +
        "variable costs = quantity × variable cost\n" +
        "margin = sales − variable costs\n" +
        "result = margin − fixed costs"
      )}

      <div class="card input-card">
        <div class="fields">
          ${field("unitQuantity", tr(currentLang, "quantity"))}
          ${field("unitPrice", tr(currentLang, "price"))}
          ${field("unitVariable", tr(currentLang, "variableUnit"))}
          ${field("unitFixed", tr(currentLang, "fixed"))}
        </div>

        ${actionButtons(
          "runUnitContribution()",
          "exampleUnitContribution()",
          "clearUnitContribution()"
        )}
      </div>

      ${resultArea("contribution")}
    `;
    return;
  }

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
    ${tabs}
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


function runUnitContribution() {
  try {
    setCalculationOutput(
      "contribution",
      calculateUnitContribution(
        {
          quantity: el("unitQuantity").value,
          price: el("unitPrice").value,
          variable: el("unitVariable").value,
          fixed: el("unitFixed").value,
        },
        currentLang
      )
    );
  } catch {
    setError("contribution");
  }
}

function exampleUnitContribution() {
  el("unitQuantity").value = "750";
  el("unitPrice").value = "4,50";
  el("unitVariable").value = "2,00";
  el("unitFixed").value = "0";
  runUnitContribution();
}

function clearUnitContribution() {
  clearFields(
    ["unitQuantity", "unitPrice", "unitVariable", "unitFixed"],
    "contribution"
  );
}



function renderIndexes() {
  el("moduleTitle").textContent = tr(currentLang, "navIndexes");

  const tabs = `
    <div class="tabs">
      <button
        class="tab-button ${currentIndexTab === "change" ? "active" : ""}"
        onclick="currentIndexTab='change';renderIndexes()"
      >
        ${tr(currentLang, "percentageChange")}
      </button>

      <button
        class="tab-button ${currentIndexTab === "indexed" ? "active" : ""}"
        onclick="currentIndexTab='indexed';renderIndexes()"
      >
        ${tr(currentLang, "indexedValue")}
      </button>

      <button
        class="tab-button ${currentIndexTab === "base100" ? "active" : ""}"
        onclick="currentIndexTab='base100';renderIndexes()"
      >
        ${tr(currentLang, "base100")}
      </button>
    </div>
  `;

  if (currentIndexTab === "indexed") {
    el("content").innerHTML = `
      ${tabs}

      ${formulaCard(
        "new value = old value × new index / old index"
      )}

      <div class="card input-card">
        <div class="fields">
          ${field("indexedOldValue", tr(currentLang, "oldValue"))}
          ${field("indexedOldIndex", tr(currentLang, "oldIndex"))}
          ${field("indexedNewIndex", tr(currentLang, "newIndex"))}
        </div>

        ${actionButtons(
          "runIndexedValue()",
          "exampleIndexedValue()",
          "clearIndexedValue()"
        )}
      </div>

      ${resultArea("index")}
    `;
    return;
  }

  if (currentIndexTab === "base100") {
    const seriesFields = Array.from(
      { length: 6 },
      (_, index) =>
        field(
          `indexSeries${index + 1}`,
          `${tr(currentLang, "value")} ${index + 1}`
        )
    ).join("");

    el("content").innerHTML = `
      ${tabs}

      ${formulaCard("index = value / base value × 100")}

      <div class="card input-card">
        <div class="fields">
          ${seriesFields}
        </div>

        ${actionButtons(
          "runBase100()",
          "exampleBase100()",
          "clearBase100()"
        )}
      </div>

      ${resultArea("index")}
    `;
    return;
  }

  const formula =
    currentLang === "FI"
      ? "Muutos % = (uusi arvo − vanha arvo) / vanha arvo × 100"
      : currentLang === "EN"
      ? "Change % = (new value − old value) / old value × 100"
      : "Cambio % = (valor nuevo − valor antiguo) / valor antiguo × 100";

  el("content").innerHTML = `
    ${tabs}
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


function runIndexedValue() {
  try {
    setCalculationOutput(
      "index",
      calculateIndexedValue(
        {
          oldValue: el("indexedOldValue").value,
          oldIndex: el("indexedOldIndex").value,
          newIndex: el("indexedNewIndex").value,
        },
        currentLang
      )
    );
  } catch {
    setError("index");
  }
}

function exampleIndexedValue() {
  el("indexedOldValue").value = "235,86";
  el("indexedOldIndex").value = "100";
  el("indexedNewIndex").value = "112";
  runIndexedValue();
}

function clearIndexedValue() {
  clearFields(
    ["indexedOldValue", "indexedOldIndex", "indexedNewIndex"],
    "index"
  );
}

function runBase100() {
  try {
    const values = [];

    for (let i = 1; i <= 6; i += 1) {
      const value = el(`indexSeries${i}`)?.value.trim();
      if (value) values.push(value);
    }

    setCalculationOutput(
      "index",
      calculateBase100(
        { values: values.join(";") },
        currentLang
      )
    );
  } catch {
    setError("index");
  }
}

function exampleBase100() {
  const values = ["4,6", "8,3", "7,7", "9,4", "10,0"];

  for (let i = 1; i <= 6; i += 1) {
    el(`indexSeries${i}`).value = values[i - 1] || "";
  }

  runBase100();
}

function clearBase100() {
  clearFields(
    Array.from({ length: 6 }, (_, index) => `indexSeries${index + 1}`),
    "index"
  );
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

function clearTrigonometry() {
  clearFields(["opposite", "adjacent"], "trigonometry");
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

// Phase 1 web-only extensions. They reuse the existing cards, tabs and result areas.
let probTab="simple";
function renderEquations(){el("moduleTitle").textContent=tr(currentLang,"navEquations");el("content").innerHTML=`<div class="tabs"><button class="tab-button ${currentEquationTab==='linear'?"active":""}" onclick="currentEquationTab='linear';renderEquations()">${tr(currentLang,"linearEquation")}</button><button class="tab-button ${currentEquationTab==='quadratic'?"active":""}" onclick="currentEquationTab='quadratic';renderEquations()">${tr(currentLang,"quadraticEquation")}</button><button class="tab-button ${currentEquationTab==='system'?"active":""}" onclick="currentEquationTab='system';renderEquations()">${tr(currentLang,"systems")}</button></div><div id="equationTabContent"></div>`; if(currentEquationTab==='system'){el("equationTabContent").innerHTML=`${formulaCard("a₁x + b₁y = c₁\na₂x + b₂y = c₂") }<div class="card input-card"><div class="fields">${field("sysA1",tr(currentLang,"systemA1"))}${field("sysB1",tr(currentLang,"systemB1"))}${field("sysC1",tr(currentLang,"systemC1"))}${field("sysA2",tr(currentLang,"systemA2"))}${field("sysB2",tr(currentLang,"systemB2"))}${field("sysC2",tr(currentLang,"systemC2"))}</div>${actionButtons("runSystem()","exampleSystem()","clearSystem()")}</div>${resultArea("system")}`;}else renderEquationTabContent();}
function runSystem(){try{setCalculationOutput("system",calculateSystem({a1:el("sysA1").value,b1:el("sysB1").value,c1:el("sysC1").value,a2:el("sysA2").value,b2:el("sysB2").value,c2:el("sysC2").value},currentLang));}catch{setError("system");}} function exampleSystem(){["sysA1","sysB1","sysC1","sysA2","sysB2","sysC2"].forEach((id,i)=>el(id).value=[2,1,5,1,-1,1][i]);runSystem();} function clearSystem(){clearFields(["sysA1","sysB1","sysC1","sysA2","sysB2","sysC2"],"system");}

function renderTrigonometry(){el("moduleTitle").textContent=tr(currentLang,"navTrigonometry");el("content").innerHTML=`${formulaCard("tan(A) = opposite / adjacent\nh² = opposite² + adjacent²") }<div class="card input-card"><div class="fields">${field("opposite",tr(currentLang,"opposite"))}${field("adjacent",tr(currentLang,"adjacent"))}${field("hypotenuse",tr(currentLang,"hypotenuse"))}${field("angle",tr(currentLang,"angle"))}</div>${actionButtons("runRightTriangle()","exampleTrigonometry()","clearRightTriangle()")}</div>${resultArea("trigonometry")}`;} function runRightTriangle(){try{setCalculationOutput("trigonometry",calculateRightTriangle({opposite:el("opposite").value,adjacent:el("adjacent").value,hypotenuse:el("hypotenuse").value,angle:el("angle").value},currentLang));}catch{setError("trigonometry");}} function clearRightTriangle(){clearFields(["opposite","adjacent","hypotenuse","angle"],"trigonometry");}



function renderExponential() {
  el("moduleTitle").textContent = tr(currentLang, "navExponential");

  const tabs = `
    <div class="tabs">
      <button
        class="tab-button ${currentExponentialTab === "standard" ? "active" : ""}"
        onclick="currentExponentialTab='standard';renderExponential()"
      >
        ${tr(currentLang, "exponentialStandard")}
      </button>

      <button
        class="tab-button ${currentExponentialTab === "taxed" ? "active" : ""}"
        onclick="currentExponentialTab='taxed';renderExponential()"
      >
        ${tr(currentLang, "taxedGrowth")}
      </button>
    </div>
  `;

  if (currentExponentialTab === "taxed") {
    el("content").innerHTML = `
      ${tabs}

      ${formulaCard(
        "interest = capital × annual rate\n" +
        "tax = interest × tax rate\n" +
        "new capital = capital + interest − tax"
      )}

      <div class="card input-card">
        <div class="fields">
          ${field("growthStart", tr(currentLang, "startCapital"))}
          ${field("growthRate", tr(currentLang, "annualInterest"))}
          ${field("growthTax", tr(currentLang, "taxRate"))}
          ${field("growthYears", tr(currentLang, "growthYears"))}
        </div>

        ${actionButtons(
          "runTaxedGrowth()",
          "exampleTaxedGrowth()",
          "clearTaxedGrowth()"
        )}
      </div>

      ${resultArea("exponential")}
    `;
    return;
  }

  el("content").innerHTML = `
    ${tabs}

    ${formulaCard(
      "f(t) = k · a^t\n" +
      "t = ln(target / k) / ln(a)"
    )}

    <div class="card input-card">
      <div class="fields">
        ${field("initialValue", tr(currentLang, "initialValue"))}
        ${field("factor", tr(currentLang, "factor"))}
        ${field("time", tr(currentLang, "time"))}
        ${field("targetValue", tr(currentLang, "targetValue"))}
      </div>

      ${actionButtons(
        "runExponentialAdvanced()",
        "exampleExponential()",
        "clearExponentialAdvanced()"
      )}
    </div>

    ${resultArea("exponential")}
  `;
}

function runExponentialAdvanced(){try{setCalculationOutput("exponential",calculateExponentialAdvanced({k:el("initialValue").value,a:el("factor").value,t:el("time").value,target:el("targetValue").value},currentLang));}catch{setError("exponential");}} function clearExponentialAdvanced(){clearFields(["initialValue","factor","time","targetValue"],"exponential");}



function runTaxedGrowth() {
  try {
    setCalculationOutput(
      "exponential",
      calculateTaxedGrowth(
        {
          start: el("growthStart").value,
          rate: el("growthRate").value,
          tax: el("growthTax").value,
          years: el("growthYears").value,
        },
        currentLang
      )
    );
  } catch {
    setError("exponential");
  }
}

function exampleTaxedGrowth() {
  el("growthStart").value = "1";
  el("growthRate").value = "0,8";
  el("growthTax").value = "30";
  el("growthYears").value = "5";
  runTaxedGrowth();
}

function clearTaxedGrowth() {
  clearFields(
    ["growthStart", "growthRate", "growthTax", "growthYears"],
    "exponential"
  );
}

function renderProbability() {
  el("moduleTitle").textContent = tr(currentLang, "navProbability");

  const existingMode = el("probMode")?.value || "two";
  const mode = ["one", "two", "custom"].includes(existingMode)
    ? existingMode
    : "two";

  const existingKind = el("probKind")?.value;
  const defaultKind = mode === "one" ? "equal" : "sum";
  const kind = existingKind || defaultKind;

  const existingCompare = el("probCompare")?.value || "equal";

  const tabs = `
    <div class="tabs">
      <button
        class="tab-button ${probTab === "simple" ? "active" : ""}"
        onclick="probTab='simple';renderProbability()"
      >
        ${tr(currentLang, "simpleMode")}
      </button>
      <button
        class="tab-button ${probTab === "advanced" ? "active" : ""}"
        onclick="probTab='advanced';renderProbability()"
      >
        ${tr(currentLang, "advanced")}
      </button>
    </div>
  `;

  const simple = `
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

  if (probTab !== "advanced") {
    el("content").innerHTML = tabs + simple;
    return;
  }

  const oneDieOptions = `
    <option value="equal">${tr(currentLang, "equal")}</option>
    <option value="greater">${tr(currentLang, "greater")}</option>
    <option value="less">${tr(currentLang, "less")}</option>
    <option value="greaterEqual">${tr(currentLang, "greaterEqual")}</option>
    <option value="lessEqual">${tr(currentLang, "lessEqual")}</option>
  `;

  const twoDiceOptions = `
    <option value="sum">${tr(currentLang, "sum")}</option>
    <option value="product">${tr(currentLang, "product")}</option>
    <option value="atleast">${tr(currentLang, "atLeastOne")}</option>
    <option value="divisible">${tr(currentLang, "divisible")}</option>
  `;

  const options = mode === "one" ? oneDieOptions : twoDiceOptions;

  const secondDie =
    mode === "one"
      ? ""
      : field(
          "probSides2",
          tr(currentLang, "secondSideCount"),
          mode === "custom" ? "4" : "6"
        );

  const needsComparison =
    mode !== "one" && (kind === "sum" || kind === "product");

  const comparisonField = needsComparison
    ? `
      <div class="field">
        <label for="probCompare">${tr(currentLang, "comparison")}</label>
        <select id="probCompare">
          <option value="equal">${tr(currentLang, "equal")}</option>
          <option value="greater">${tr(currentLang, "greater")}</option>
          <option value="less">${tr(currentLang, "less")}</option>
          <option value="greaterEqual">${tr(currentLang, "greaterEqual")}</option>
          <option value="lessEqual">${tr(currentLang, "lessEqual")}</option>
        </select>
      </div>
    `
    : "";

  const needsTarget = kind !== "divisible";

  const targetField = needsTarget
    ? field(
        "probTarget",
        tr(currentLang, "target"),
        mode === "one" ? "5" : kind === "product" ? "16" : "10"
      )
    : "";

  const modeLabel = tr(
    currentLang,
    mode === "one"
      ? "dieOne"
      : mode === "custom"
        ? "customDice"
        : "diceTwo"
  );

  const advanced = `
    <div class="card input-card">
      <div class="fields">
        <div class="field">
          <label for="probMode">${modeLabel}</label>
          <select id="probMode" onchange="handleProbabilityModeChange()">
            <option value="one">${tr(currentLang, "dieOne")}</option>
            <option value="two">${tr(currentLang, "diceTwo")}</option>
            <option value="custom">${tr(currentLang, "customDice")}</option>
          </select>
        </div>

        ${field("probSides", tr(currentLang, "sideCount"), "6")}
        ${secondDie}

        <div class="field">
          <label for="probKind">${tr(currentLang, "probabilityKind")}</label>
          <select id="probKind" onchange="handleProbabilityKindChange()">
            ${options}
          </select>
        </div>

        ${comparisonField}
        ${targetField}
      </div>

      ${actionButtons(
        "runAdvancedProbability()",
        "exampleAdvancedProbability()",
        "clearAdvancedProbability()"
      )}
    </div>

    ${resultArea("probability")}
  `;

  el("content").innerHTML = tabs + advanced;

  el("probMode").value = mode;

  const kindElement = el("probKind");
  const validKinds =
    mode === "one"
      ? ["equal", "greater", "less", "greaterEqual", "lessEqual"]
      : ["sum", "product", "atleast", "divisible"];

  kindElement.value = validKinds.includes(kind)
    ? kind
    : defaultKind;

  if (el("probCompare")) {
    el("probCompare").value = existingCompare;
  }
}

function handleProbabilityModeChange() {
  renderProbability();
}

function handleProbabilityKindChange() {
  renderProbability();
}

function runAdvancedProbability() {
  try {
    const mode = el("probMode").value;

    const output = calculateAdvancedProbability(
      {
        mode,
        sides: el("probSides").value,
        sides2:
          mode === "one"
            ? null
            : el("probSides2")?.value,
        target:
          el("probTarget")?.value ?? null,
        kind: el("probKind").value,
        compare:
          el("probCompare")?.value ?? "equal",
      },
      currentLang
    );

    setCalculationOutput("probability", output);
  } catch (error) {
    console.error("Advanced probability error:", error);
    setError("probability");
  }
}

function exampleAdvancedProbability() {
  const mode = el("probMode")?.value || "two";

  el("probSides").value = "6";

  if (mode === "one") {
    el("probKind").value = "equal";
    el("probTarget").value = "5";
  } else {
    if (el("probSides2")) {
      el("probSides2").value = mode === "custom" ? "4" : "6";
    }

    el("probKind").value = "sum";

    if (el("probCompare")) {
      el("probCompare").value = "equal";
    }

    el("probTarget").value = "10";
  }

  runAdvancedProbability();
}

function renderVat() {
  el("moduleTitle").textContent = tr(currentLang, "navVat");
  el("content").innerHTML = `${formulaCard("gross = net × (1 + rate)\nVAT = gross − net\nnet = gross / (1 + rate)")}<div class="card input-card"><div class="fields"><div class="field"><label for="vatMode">${tr(currentLang,"mode")}</label><select id="vatMode"><option value="net">${tr(currentLang,"netToGross")}</option><option value="gross">${tr(currentLang,"grossToNet")}</option></select></div>${field("vatAmount",tr(currentLang,"amount"))}${field("vatRate",tr(currentLang,"rate"))}</div>${actionButtons("runVat()","exampleVat()","clearVat()")}</div>${resultArea("vat")}`;
}
function runVat(){try{setCalculationOutput("vat",calculateVat({amount:el("vatAmount").value,rate:el("vatRate").value,mode:el("vatMode").value},currentLang));}catch{setError("vat");}}
function exampleVat(){el("vatMode").value="net";el("vatAmount").value="100";el("vatRate").value="24";runVat();}
function clearVat(){clearFields(["vatAmount","vatRate"],"vat");}

function clearAdvancedProbability() {
  clearFields(
    ["probSides", "probSides2", "probTarget"],
    "probability"
  );

  renderProbability();
}

document.addEventListener("DOMContentLoaded", () => {
  updateGlobalLanguageUI();

  el("languageSelect").addEventListener("change", (event) => {
    changeLanguage(event.target.value);
  });

  renderNavigation();
  showModule("loans");
});

// Clean Phase 1 overrides: keep submode examples self-contained and avoid
// emitting template punctuation into the page.
function exampleTrigonometry() { clearFields(["opposite", "adjacent", "hypotenuse", "angle"], "trigonometry"); el("opposite").value = "3"; el("adjacent").value = "4"; runRightTriangle(); }
function exampleExponential() { clearFields(["initialValue", "factor", "time", "targetValue"], "exponential"); el("initialValue").value = "1000"; el("factor").value = "1.05"; el("time").value = "3"; runExponentialAdvanced(); }
