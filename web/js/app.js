let currentLang = "ES";
let currentModule = "loans";
let currentLoanTab = "constant";
let currentEquationTab = "linear";
let currentContributionTab = "direct";
let currentIndexTab = "change";
let currentExponentialTab = "standard";
let currentFunctionTab = "linear";

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
  ["functions", "navFunctions"],
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


function field(name, label, value = "", allowSign = false) {
  return `
    <div class="field">
      <label for="${name}">${escapeHtml(label)}</label>

      <div class="${allowSign ? "signed-input" : ""}">
        <input
          id="${name}"
          name="${name}"
          type="text"
          inputmode="decimal"
          value="${escapeHtml(value)}"
          autocomplete="off"
        >

        ${
          allowSign
            ? `
              <button
                type="button"
                class="sign-toggle"
                aria-label="Toggle sign"
                onclick="toggleSign('${name}')"
              >
                ±
              </button>
            `
            : ""
        }
      </div>
    </div>
  `;
}

function toggleSign(id) {
  const input = el(id);

  if (!input) return;

  const raw = input.value.trim();

  if (!raw) {
    input.value = "-";
    input.focus();
    return;
  }

  input.value =
    raw.startsWith("-")
      ? raw.slice(1)
      : `-${raw}`;

  input.focus();
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
    case "functions":
      renderFunctions();
      break;
  }
}



function graphSvg(points, type = "line", labels = []) {
  const width = 720;
  const height = 300;
  const padLeft = 48;
  const padRight = 24;
  const padTop = 30;
  const padBottom = 48;

  if (!points.length) return "";

  const values = points.map((point) => point.y);

  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const x = (index) =>
    padLeft +
    (
      points.length === 1
        ? plotWidth / 2
        : plotWidth * index / (points.length - 1)
    );

  const y = (value) =>
    padTop +
    (max - value) / span * plotHeight;

  const axisY = y(0);

  const barWidth = Math.max(
    6,
    Math.min(
      54,
      plotWidth / Math.max(points.length, 1) * 0.62
    )
  );

  const bars =
    type === "bar"
      ? points
          .map((point, index) => {
            const top = Math.min(y(point.y), axisY);
            const barHeight = Math.abs(y(point.y) - axisY);

            return `
              <rect
                x="${x(index) - barWidth / 2}"
                y="${top}"
                width="${barWidth}"
                height="${barHeight}"
                fill="#ff9f0a"
                rx="4"
              />
            `;
          })
          .join("")
      : "";

  const polyline =
    type === "line"
      ? `
        <polyline
          points="${points
            .map(
              (point, index) =>
                `${x(index)},${y(point.y)}`
            )
            .join(" ")}"
          fill="none"
          stroke="#ff9f0a"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      `
      : "";

  /*
   * Short educational graphs benefit from visible data points.
   * Long loan schedules become unreadable with dozens of circles,
   * so markers are intentionally suppressed there.
   */
  const markers =
    type === "line" && points.length <= 20
      ? points
          .map(
            (point, index) => `
              <circle
                cx="${x(index)}"
                cy="${y(point.y)}"
                r="4"
                fill="#ffffff"
              />
            `
          )
          .join("")
      : "";

  /*
   * Keep the X axis readable on a phone.
   * At most six labels are distributed across the entire series,
   * always including the first and last point.
   */
  const maxLabels = 6;

  const tickIndexes =
    points.length <= maxLabels
      ? points.map((_, index) => index)
      : Array.from(
          { length: maxLabels },
          (_, index) =>
            Math.round(
              index *
              (points.length - 1) /
              (maxLabels - 1)
            )
        );

  const uniqueTickIndexes = [
    ...new Set(tickIndexes),
  ];

  const ticks = uniqueTickIndexes
    .map((index) => {
      const point = points[index];

      const label =
        labels[index] ??
        point.x;

      return `
        <line
          x1="${x(index)}"
          y1="${height - padBottom}"
          x2="${x(index)}"
          y2="${height - padBottom + 5}"
          stroke="#777"
        />

        <text
          x="${x(index)}"
          y="${height - 16}"
          text-anchor="middle"
          fill="#a7a7ad"
          font-size="12"
        >
          ${escapeHtml(label)}
        </text>
      `;
    })
    .join("");

  return `
    <svg
      class="calc-chart"
      viewBox="0 0 ${width} ${height}"
      role="img"
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        x1="${padLeft}"
        y1="${axisY}"
        x2="${width - padRight}"
        y2="${axisY}"
        stroke="#777"
      />

      <line
        x1="${padLeft}"
        y1="${padTop}"
        x2="${padLeft}"
        y2="${height - padBottom}"
        stroke="#777"
      />

      ${polyline}
      ${bars}
      ${markers}
      ${ticks}
    </svg>
  `;
}

function parseList(value) {
  const text = String(value).trim();

  if (!text) return [];

  const parts =
    /[;\n]/.test(text)
      ? text.split(/[;\n]+/)
      : text.split(/,\s*/);

  return parts
    .map((item) => numberValue(item.trim()))
    .filter((item) => Number.isFinite(item));
}

function renderFunctions() {
  el("moduleTitle").textContent = tr(currentLang, "navFunctions");
  const tabs = [["linear","linearFunction"],["piecewise","piecewiseFunction"],["dataset","dataChart"],["pie","pieChart"],["loan","loanChart"]];
  el("content").innerHTML = `<div class="tabs">${tabs.map(([k,l])=>`<button class="tab-button ${currentFunctionTab===k?"active":""}" onclick="currentFunctionTab='${k}';renderFunctions()">${tr(currentLang,l)}</button>`).join("")}</div><div id="functionTabContent"></div>`;
  const c=el("functionTabContent");
  if(currentFunctionTab==="linear") c.innerHTML=`${formulaCard("f(x) = m × x + b")}<div class="card input-card"><div class="fields">${field("fnM",tr(currentLang,"slope"),"10.5",true)}${field("fnB",tr(currentLang,"intercept"),"0",true)}${field("fnStart",tr(currentLang,"xStart"),"4",true)}${field("fnEnd",tr(currentLang,"xEnd"),"10",true)}${field("fnStep",tr(currentLang,"step"),"1")}${field("fnX",tr(currentLang,"evaluateX"),"10",true)}</div>${actionButtons("runLinearFunction()","exampleLinearFunction()","clearLinearFunction()")}</div><div id="functionOutput"></div>`;
  else if(currentFunctionTab==="piecewise") c.innerHTML=`${formulaCard("x ≤ breakpoint: rate × x\nx > breakpoint: rate × breakpoint + rate × multiplier × (x − breakpoint)")}<div class="card input-card"><div class="fields">${field("pwRate",tr(currentLang,"baseRate"),"10.5")}${field("pwBreak",tr(currentLang,"breakpoint"),"8",true)}${field("pwMult",tr(currentLang,"multiplier"),"1.5")}${field("pwStart",tr(currentLang,"xStart"),"6",true)}${field("pwEnd",tr(currentLang,"xEnd"),"10",true)}${field("pwStep",tr(currentLang,"step"),"1")}${field("pwX",tr(currentLang,"evaluateX"),"10",true)}</div>${actionButtons("runPiecewiseFunction()","examplePiecewiseFunction()","clearPiecewiseFunction()")}</div><div id="functionOutput"></div>`;
  else if(currentFunctionTab==="dataset") c.innerHTML=`<div class="card input-card"><div class="fields">${field("dataLabels",tr(currentLang,"labels"),"A, B, C, D, E")}${field("dataValues",tr(currentLang,"values"),"4.6, 8.3, 7.7, 9.4, 10")}</div><div class="field"><label>${tr(currentLang,"chartType")}</label><select id="dataType"><option value="line">${tr(currentLang,"lineChart")}</option><option value="bar">${tr(currentLang,"barChart")}</option></select></div>${actionButtons("runDatasetChart()","exampleDatasetChart()","clearDatasetChart()")}</div><div id="functionOutput"></div>`;
  else if(currentFunctionTab==="pie") c.innerHTML=`<div class="card input-card"><div class="field"><label>${tr(currentLang,"mode")}</label><select id="pieMode"><option value="values">${tr(currentLang,"valuesToPercentages")}</option><option value="percentages">${tr(currentLang,"percentagesToValues")}</option></select></div>${field("pieLabels",tr(currentLang,"labels"),"Goods, Food, Office, Facilities, Salaries, Chemicals")}${field("pieValues",tr(currentLang,"values"),"10, 23, 1, 5, 59, 2")}${field("pieTotal",tr(currentLang,"totalAmount"),"25480")}${actionButtons("runPieChart()","examplePieChart()","clearPieChart()")}</div><div id="functionOutput"></div>`;
  else c.innerHTML=`<div class="card input-card"><div class="field"><label>${tr(currentLang,"loanType")}</label><select id="chartLoanType"><option value="constant">${tr(currentLang,"constantLoan")}</option><option value="annuity">${tr(currentLang,"annuityLoan")}</option></select></div><div class="fields">${field("chartCapital",tr(currentLang,"capital"),"210000")}${field("chartMonths",tr(currentLang,"months"),"300")}${field("chartInterest",tr(currentLang,"annualInterest"),"1.26")}${field("chartInstallment",tr(currentLang,"installmentNumber"),"1")}</div><div class="field"><label for="chartMetric">${tr(currentLang,"chartMetric")}</label><select id="chartMetric"><option value="remaining">${tr(currentLang,"remainingBalance")}</option><option value="interest">${tr(currentLang,"interestComponent")}</option><option value="principal">${tr(currentLang,"principalComponent")}</option><option value="payment">${tr(currentLang,"payment")}</option></select></div>${actionButtons("runLoanChart()","exampleLoanChart()","clearLoanChart()")}</div><div id="functionOutput"></div>`;
}

function outputFunction(title, text, chart = "") {
  el("functionOutput").innerHTML = `
    <div class="card result-card">
      <h2>${escapeHtml(title)}</h2>
      <div class="function-result-text">${escapeHtml(text)}</div>
    </div>

    ${
      chart
        ? `<div class="card chart-card">${chart}</div>`
        : ""
    }
  `;
}

function rangePoints(start,end,step,fn){const a=[]; for(let x=start;x<=end+step/1000&&a.length<200;x+=step)a.push({x,y:fn(x)}); return a;}

function runLinearFunction() {
  try {
    const m = numberValue(el("fnM").value);
    const b = numberValue(el("fnB").value);
    const start = numberValue(el("fnStart").value);
    const end = numberValue(el("fnEnd").value);
    const step = numberValue(el("fnStep").value);
    const evaluateX = numberValue(el("fnX").value);

    if (
      ![m, b, start, end, step, evaluateX].every(Number.isFinite) ||
      step <= 0 ||
      end < start
    ) {
      throw new Error("invalid_input");
    }

    const points = rangePoints(
      start,
      end,
      step,
      (x) => m * x + b
    );

    const trend =
      m > 0
        ? tr(currentLang, "increasing")
        : m < 0
          ? tr(currentLang, "decreasing")
          : tr(currentLang, "constantFunction");

    const evaluated = m * evaluateX + b;

    outputFunction(
      `f(${evaluateX}) = ${evaluated.toFixed(2)}`,
      `${tr(currentLang, "slope")}: ${m}\n` +
      `${tr(currentLang, "intercept")}: ${b}\n` +
      `${tr(currentLang, "functionBehavior")}: ${trend}\n\n` +
      `${tr(currentLang, "valueTable")}:\n` +
      points
        .map(
          (point) =>
            `${point.x.toFixed(2)} | ${point.y.toFixed(2)}`
        )
        .join("\n"),
      graphSvg(points)
    );
  } catch {
    outputFunction(
      tr(currentLang, "invalidInput"),
      ""
    );
  }
}

function exampleLinearFunction(){el("fnM").value="10.5";el("fnB").value="0";el("fnStart").value="4";el("fnEnd").value="10";el("fnStep").value="1";el("fnX").value="10";runLinearFunction();} function clearLinearFunction(){renderFunctions();}

function runPiecewiseFunction() {
  try {
    const rate = numberValue(el("pwRate").value);
    const breakpoint = numberValue(el("pwBreak").value);
    const multiplier = numberValue(el("pwMult").value);
    const start = numberValue(el("pwStart").value);
    const end = numberValue(el("pwEnd").value);
    const step = numberValue(el("pwStep").value);
    const evaluateX = numberValue(el("pwX").value);

    if (
      ![
        rate,
        breakpoint,
        multiplier,
        start,
        end,
        step,
        evaluateX,
      ].every(Number.isFinite) ||
      step <= 0 ||
      end < start ||
      multiplier < 0
    ) {
      throw new Error("invalid_input");
    }

    const fn = (x) =>
      x <= breakpoint
        ? rate * x
        : rate * breakpoint +
          rate * multiplier * (x - breakpoint);

    const points = rangePoints(
      start,
      end,
      step,
      fn
    );

    const afterRate = rate * multiplier;

    outputFunction(
      `${tr(currentLang, "piecewiseFunction")} · ${evaluateX} = ${fn(evaluateX).toFixed(2)}`,
      `${tr(currentLang, "baseRate")}: ${rate.toFixed(2)}\n` +
      `${tr(currentLang, "breakpoint")}: ${breakpoint}\n` +
      `${tr(currentLang, "multiplier")}: ${multiplier}\n` +
      `${tr(currentLang, "rateAfterBreakpoint")}: ${afterRate.toFixed(2)}\n\n` +
      `${tr(currentLang, "valueTable")}:\n` +
      points
        .map(
          (point) =>
            `${point.x.toFixed(2)} | ${point.y.toFixed(2)}`
        )
        .join("\n"),
      graphSvg(points)
    );
  } catch {
    outputFunction(
      tr(currentLang, "invalidInput"),
      ""
    );
  }
}

function examplePiecewiseFunction(){el("pwRate").value="10.5";el("pwBreak").value="8";el("pwMult").value="1.5";el("pwStart").value="6";el("pwEnd").value="10";el("pwStep").value="1";el("pwX").value="10";runPiecewiseFunction();} function clearPiecewiseFunction(){renderFunctions();}

function runDatasetChart() {
  const values = parseList(
    el("dataValues").value
  ).slice(0, 12);

  const labels = el("dataLabels")
    .value
    .split(/[,;]+/)
    .map((value) => value.trim());

  if (values.length < 2) {
    outputFunction(
      tr(currentLang, "invalidInput"),
      ""
    );
    return;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0
  );

  const mean = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  const minIndex = values.indexOf(min);
  const maxIndex = values.indexOf(max);

  const first = values[0];
  const last = values.at(-1);

  const change =
    first !== 0
      ? ((last - first) / first) * 100
      : null;

  const changeText =
    change === null
      ? tr(currentLang, "notAvailable")
      : `${change.toFixed(2)} %`;

  outputFunction(
    tr(currentLang, "statistics"),
    `${tr(currentLang, "count")}: ${values.length}\n` +
    `${tr(currentLang, "total")}: ${total.toFixed(2)}\n` +
    `${tr(currentLang, "mean")}: ${mean.toFixed(2)}\n` +
    `${tr(currentLang, "minimum")}: ${min.toFixed(2)} (${labels[minIndex] || minIndex + 1})\n` +
    `${tr(currentLang, "maximum")}: ${max.toFixed(2)} (${labels[maxIndex] || maxIndex + 1})\n` +
    `${tr(currentLang, "range")}: ${range.toFixed(2)}\n` +
    `${tr(currentLang, "firstToLastChange")}: ${changeText}`,
    graphSvg(
      values.map(
        (value, index) => ({
          x: index,
          y: value,
        })
      ),
      el("dataType").value,
      labels
    )
  );
}

function exampleDatasetChart(){runDatasetChart();} function clearDatasetChart(){renderFunctions();}

function runPieChart() {
  const labels = el("pieLabels")
    .value
    .split(/[,;]+/)
    .map((value) => value.trim());

  const raw = parseList(el("pieValues").value);
  const mode = el("pieMode").value;

  const totalAmount =
    mode === "percentages"
      ? numberValue(el("pieTotal").value)
      : null;

  if (
    raw.length < 2 ||
    raw.length > 10 ||
    !raw.every(
      (value) =>
        Number.isFinite(value) && value >= 0
    ) ||
    (
      mode === "percentages" &&
      (
        !Number.isFinite(totalAmount) ||
        totalAmount <= 0
      )
    )
  ) {
    outputFunction(
      tr(currentLang, "invalidInput"),
      ""
    );
    return;
  }

  const values =
    mode === "percentages"
      ? raw.map(
          (percentage) =>
            totalAmount * percentage / 100
        )
      : raw;

  const chartTotal = values.reduce(
    (sum, value) => sum + value,
    0
  );

  if (chartTotal <= 0) {
    outputFunction(
      tr(currentLang, "invalidInput"),
      ""
    );
    return;
  }

  const largestIndex = values.indexOf(
    Math.max(...values)
  );

  const smallestPositive = Math.min(
    ...values.filter((value) => value > 0)
  );

  const smallestIndex =
    values.indexOf(smallestPositive);

  let start = 0;

  const paths = values
    .map((value, index) => {
      if (value === 0) return "";

      const angleStart =
        start / chartTotal * Math.PI * 2;

      start += value;

      const angleEnd =
        start / chartTotal * Math.PI * 2;

      const x1 =
        50 + 42 * Math.cos(angleStart);

      const y1 =
        50 + 42 * Math.sin(angleStart);

      const x2 =
        50 + 42 * Math.cos(angleEnd);

      const y2 =
        50 + 42 * Math.sin(angleEnd);

      return `
        <path
          d="M50 50
             L${x1} ${y1}
             A42 42 0 ${angleEnd - angleStart > Math.PI ? 1 : 0} 1 ${x2} ${y2}
             Z"
          fill="hsl(${index * 55 % 360} 80% 55%)"
        />
      `;
    })
    .join("");

  const rows = values.map(
    (value, index) => {
      const percentage =
        value / chartTotal * 100;

      const angle =
        value / chartTotal * 360;

      if (mode === "percentages") {
        return (
          `${labels[index] || index + 1}: ` +
          `${formatMoney(value)} € · ` +
          `${raw[index].toFixed(2)} % · ` +
          `${angle.toFixed(1)}°`
        );
      }

      return (
        `${labels[index] || index + 1}: ` +
        `${value.toFixed(2)} · ` +
        `${percentage.toFixed(2)} % · ` +
        `${angle.toFixed(1)}°`
      );
    }
  );

  outputFunction(
    tr(currentLang, "pieChart"),
    (
      mode === "percentages"
        ? `${tr(currentLang, "totalAmount")}: ${formatMoney(totalAmount)} €\n`
        : `${tr(currentLang, "total")}: ${chartTotal.toFixed(2)}\n`
    ) +
    `${tr(currentLang, "largest")}: ${labels[largestIndex] || largestIndex + 1}\n` +
    `${tr(currentLang, "smallest")}: ${labels[smallestIndex] || smallestIndex + 1}\n\n` +
    rows.join("\n"),
    `<svg
       class="calc-chart pie-chart"
       viewBox="0 0 100 100"
       role="img"
     >
       ${paths}
     </svg>`
  );
}

function examplePieChart(){runPieChart();} function clearPieChart(){renderFunctions();}

function runLoanChart() {
  try {
    const data = {
      capital: el("chartCapital").value,
      months: el("chartMonths").value,
      annualInterest: el("chartInterest").value,
      installment: el("chartInstallment").value,
    };

    const constant =
      el("chartLoanType").value === "constant";

    const output = constant
      ? calculateLoanSchedule(data)
      : calculateAnnuityDetails(data);

    const selected = output.selected;

    const metric =
      el("chartMetric")?.value ||
      "remaining";

    const metricValue = (row) => {
      switch (metric) {
        case "interest":
          return row.interest;

        case "principal":
          return row.amortization ?? row.principal;

        case "payment":
          return row.payment;

        case "remaining":
        default:
          return row.remaining;
      }
    };

    const sampleEvery = Math.max(
      1,
      Math.ceil(output.rows.length / 80)
    );

    const sampledRows =
      output.rows.filter(
        (row, index) =>
          index === 0 ||
          index === output.rows.length - 1 ||
          index % sampleEvery === 0
      );

    const points = sampledRows.map(
      (row) => ({
        x: row.number,
        y: metricValue(row),
      })
    );

    outputFunction(
      `${tr(currentLang, "installmentNumber")} ${selected.number}`,
      `${tr(currentLang, "payment")}: ${formatMoney(selected.payment)} €\n` +
      `${tr(currentLang, "interestComponent")}: ${formatMoney(selected.interest)} €\n` +
      `${tr(currentLang, "principalComponent")}: ${formatMoney(selected.amortization ?? selected.principal)} €\n` +
      `${tr(currentLang, "remainingBalance")}: ${formatMoney(selected.remaining)} €`,
      graphSvg(points)
    );
  } catch {
    outputFunction(
      tr(currentLang, "invalidInput"),
      ""
    );
  }
}

function exampleLoanChart(){runLoanChart();} function clearLoanChart(){renderFunctions();}

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
        currentLang === "FI"
          ? "Katetuotto / kpl = myyntihinta − muuttuva kustannus / kpl\nKatetuottoprosentti = katetuotto / kpl ÷ myyntihinta × 100\nKriittinen myyntimäärä = kiinteät kustannukset ÷ katetuotto / kpl"
          : currentLang === "EN"
          ? "Contribution margin / unit = selling price − variable cost / unit\nContribution margin % = margin / unit ÷ selling price × 100\nBreak-even quantity = fixed costs ÷ contribution margin / unit"
          : "Margen / unidad = precio de venta − coste variable / unidad\nMargen % = margen / unidad ÷ precio de venta × 100\nCantidad de equilibrio = costes fijos ÷ margen / unidad"
      )}

      <div class="card input-card">
        <div class="fields">
          ${field("unitQuantity", tr(currentLang, "quantityOptional"))}
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
          ${field("indexedOldValue", tr(currentLang, "oldValue"), "", true)}
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
      (_, index) => {
        const label =
          index === 0
            ? `${tr(currentLang, "baseValue")} (${tr(currentLang, "value")} 1)`
            : `${tr(currentLang, "value")} ${index + 1}`;

        return field(
          `indexSeries${index + 1}`,
          label
        );
      }
    ).join("");

    el("content").innerHTML = `
      ${tabs}

      ${formulaCard(
        currentLang === "FI"
          ? "indeksi = arvo / perusarvo × 100"
          : currentLang === "EN"
          ? "index = value / base value × 100"
          : "índice = valor / valor base × 100"
      )}

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
        ${field("oldValue", tr(currentLang, "oldValue"), "", true)}
        ${field("newValue", tr(currentLang, "newValue"), "", true)}
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
          ${field("linearA", "a", "", true)}
          ${field("linearB", "b", "", true)}
          ${field("linearC", "c", "", true)}
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
          ${field("quadraticA", "a", "", true)}
          ${field("quadraticB", "b", "", true)}
          ${field("quadraticC", "c", "", true)}
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
function renderEquations(){el("moduleTitle").textContent=tr(currentLang,"navEquations");el("content").innerHTML=`<div class="tabs"><button class="tab-button ${currentEquationTab==='linear'?"active":""}" onclick="currentEquationTab='linear';renderEquations()">${tr(currentLang,"linearEquation")}</button><button class="tab-button ${currentEquationTab==='quadratic'?"active":""}" onclick="currentEquationTab='quadratic';renderEquations()">${tr(currentLang,"quadraticEquation")}</button><button class="tab-button ${currentEquationTab==='system'?"active":""}" onclick="currentEquationTab='system';renderEquations()">${tr(currentLang,"systems")}</button></div><div id="equationTabContent"></div>`; if(currentEquationTab==='system'){el("equationTabContent").innerHTML=`${formulaCard("a₁x + b₁y = c₁\na₂x + b₂y = c₂") }<div class="card input-card"><div class="fields">${field("sysA1",tr(currentLang,"systemA1"),"",true)}${field("sysB1",tr(currentLang,"systemB1"),"",true)}${field("sysC1",tr(currentLang,"systemC1"),"",true)}${field("sysA2",tr(currentLang,"systemA2"),"",true)}${field("sysB2",tr(currentLang,"systemB2"),"",true)}${field("sysC2",tr(currentLang,"systemC2"),"",true)}</div>${actionButtons("runSystem()","exampleSystem()","clearSystem()")}</div>${resultArea("system")}`;}else renderEquationTabContent();}
function runSystem(){try{setCalculationOutput("system",calculateSystem({a1:el("sysA1").value,b1:el("sysB1").value,c1:el("sysC1").value,a2:el("sysA2").value,b2:el("sysB2").value,c2:el("sysC2").value},currentLang));}catch{setError("system");}} function exampleSystem(){["sysA1","sysB1","sysC1","sysA2","sysB2","sysC2"].forEach((id,i)=>el(id).value=[2,1,5,1,-1,1][i]);runSystem();} function clearSystem(){clearFields(["sysA1","sysB1","sysC1","sysA2","sysB2","sysC2"],"system");}

function renderTrigonometry() {
  el("moduleTitle").textContent = tr(currentLang, "navTrigonometry");

  const formula =
    currentLang === "FI"
      ? "tan(A) = vastakkainen kateetti / viereinen kateetti\nh² = vastakkainen² + viereinen²"
      : currentLang === "EN"
      ? "tan(A) = opposite / adjacent\nh² = opposite² + adjacent²"
      : "tan(A) = cateto opuesto / cateto adyacente\nh² = opuesto² + adyacente²";

  el("content").innerHTML = `
    ${formulaCard(formula)}

    <div class="card input-card">
      <div class="fields">
        ${field("opposite", tr(currentLang, "opposite"))}
        ${field("adjacent", tr(currentLang, "adjacent"))}
        ${field("hypotenuse", tr(currentLang, "hypotenuse"))}
        ${field("angle", tr(currentLang, "angle"))}
      </div>

      ${actionButtons(
        "runRightTriangle()",
        "exampleTrigonometry()",
        "clearRightTriangle()"
      )}
    </div>

    ${resultArea("trigonometry")}
  `;
}

function runRightTriangle() {
  try {
    setCalculationOutput(
      "trigonometry",
      calculateRightTriangle(
        {
          opposite: el("opposite").value,
          adjacent: el("adjacent").value,
          hypotenuse: el("hypotenuse").value,
          angle: el("angle").value,
        },
        currentLang
      )
    );
  } catch {
    setError("trigonometry");
  }
}

function clearRightTriangle() {
  clearFields(
    ["opposite", "adjacent", "hypotenuse", "angle"],
    "trigonometry"
  );
}



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
        currentLang === "FI"
          ? "korko = pääoma × vuosikorko\nvero = korko × veroprosentti\nnettokorko = korko − vero\nuusi pääoma = pääoma + nettokorko"
          : currentLang === "EN"
          ? "interest = capital × annual rate\ntax = interest × tax rate\nnet interest = interest − tax\nnew capital = capital + net interest"
          : "interés = capital × tasa anual\nimpuesto = interés × tasa de impuesto\ninterés neto = interés − impuesto\nnuevo capital = capital + interés neto"
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
        ${field("time", tr(currentLang, "time"), "", true)}
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
  el("growthStart").value = "10000";
  el("growthRate").value = "4";
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
          <label for="probMode">${tr(currentLang, "diceMode")}</label>
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
