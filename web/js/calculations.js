function numberValue(value) {
  const normalized = String(value).trim().replace(",", ".");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error("invalid_number");
  }

  return parsed;
}

// The calculation strings remain separate from the numeric logic. This small
// presentation layer keeps ES/FI output unchanged while providing full EN text.
const EN_TEXT = [
  ["Pago total", "Total payment"], ["Cuota mensual fija", "Fixed monthly payment"],
  ["Resultado final", "Final result"], ["Cambio porcentual", "Percentage change"],
  ["Inflación total", "Total inflation"], ["Inflación anual", "Annual inflation"],
  ["Factor anual", "Annual factor"], ["Calculamos", "Calculate"], ["Calculamos la", "Calculate the"],
  ["tasa de interés mensual", "monthly interest rate"], ["amortización mensual", "monthly amortization"],
  ["tasa de interés", "interest rate"], ["interés anual", "annual interest"],
  ["ingresos por ventas", "sales revenue"], ["costes fijos", "fixed costs"],
  ["número total de cuotas", "total number of installments"], ["número de cuotas", "number of installments"],
  ["capital inicial", "initial capital"], ["valor inicial", "initial value"], ["factor de crecimiento o decrecimiento", "growth or decrease factor"],
  ["amortización", "amortization"], ["interés", "interest"], ["Interés", "Interest"],
  ["Saldo restante", "Remaining balance"], ["saldo restante", "remaining balance"],
  ["saldo antes de la cuota", "balance before installment"], ["Saldo", "Balance"],
  ["Pago", "Payment"], ["cuota", "installment"], ["Cuota calculada", "Calculated installment"],
  ["Interés anual", "Annual interest"], ["Margen de contribución", "Contribution margin"],
  ["Margen", "Margin"], ["Resultado", "Result"], ["Porcentaje de margen", "Margin percentage"],
  ["Cambio absoluto", "Absolute change"], ["Cambio", "Change"], ["valor nuevo", "new value"],
  ["valor antiguo", "old value"], ["IPC", "CPI"], ["Inflación", "Inflation"],
  ["Casos favorables", "Favorable cases"], ["casos favorables", "favorable cases"],
  ["casos totales", "total cases"], ["Restamos b en ambos lados", "Subtract b from both sides"],
  ["Dividimos por a", "Divide by a"], ["No hay soluciones reales", "No real solutions"],
  ["por lo tanto la ecuación no tiene soluciones reales", "therefore the equation has no real solutions"],
  ["Ángulo A", "Angle A"], ["cateto opuesto", "opposite side"], ["cateto adyacente", "adjacent side"],
  ["Crecimiento", "Growth"], ["Decrecimiento", "Decrease"], ["Constante", "Constant"],
  ["Signo alternante", "Alternating sign"], ["Tipo de función", "Function type"],
  ["Fórmula utilizada", "Formula used"], ["FÓRMULA UTILIZADA", "FORMULA USED"],
  ["FÓRMULAS UTILIZADAS", "FORMULAS USED"], ["Calculamos el", "Calculate the"],
];

function englishText(text) {
  if (typeof text !== "string") return text;
  return EN_TEXT.reduce((value, [from, to]) => value.replaceAll(from, to), text)
    .replaceAll("IPC2", "CPI2").replaceAll("IPC1", "CPI1")
    .replaceAll("= interés anual", "= annual interest")
    .replaceAll("= ingresos por ventas", "= sales revenue")
    .replaceAll("= costes variables", "= variable costs")
    .replaceAll("= costes fijos", "= fixed costs");
}

function englishOutput(output) {
  return { ...output, result: englishText(output.result), formula: englishText(output.formula), steps: englishText(output.steps) };
}


function calculateConstantLoan(data, lang) {
  const K = numberValue(data.capital);
  const n = numberValue(data.months);
  const annualRate = numberValue(data.annualInterest);
  const installment = numberValue(data.installmentNumber);

  if (K < 0 || n <= 0 || installment <= 0 || installment > n) {
    throw new Error("invalid_input");
  }

  const i = annualRate / 12 / 100;
  const amortization = K / n;
  const balanceBefore = K - amortization * (installment - 1);
  const interest = balanceBefore * i;
  const payment = amortization + interest;
  const remaining = balanceBefore - amortization;

  if (lang === "FI") {
    return {
      result: `Maksuerä: ${payment.toFixed(2)} €`,
      formula:
`Lyhennys = K / n
i = vuosikorko / 12 / 100
Saldo = K − lyhennys × (erä − 1)
Korko = saldo × i
Maksuerä = lyhennys + korko

K = lainapääoma
n = maksuerien kokonaismäärä
i = kuukausikorko
erä = laskettavan maksuerän numero`,
      steps:
`K = ${K.toFixed(2)} €
n = ${n.toFixed(0)}
Vuosikorko = ${annualRate.toFixed(2)} %
Laskettava erä = ${installment.toFixed(0)}

1. Kuukausikorko

i = vuosikorko / 12 / 100
i = ${annualRate.toFixed(2)} / 12 / 100
i = ${i.toFixed(6)}

2. Kuukausittainen lyhennys

Lyhennys = K / n
Lyhennys = ${K.toFixed(2)} / ${n.toFixed(0)}
Lyhennys = ${amortization.toFixed(2)} €

3. Saldo ennen erää ${installment.toFixed(0)}

Saldo = K − lyhennys × (erä − 1)
Saldo = ${K.toFixed(2)} − ${amortization.toFixed(2)} × (${installment.toFixed(0)} − 1)
Saldo = ${balanceBefore.toFixed(2)} €

4. Erän korko

Korko = saldo × i
Korko = ${balanceBefore.toFixed(2)} × ${i.toFixed(6)}
Korko = ${interest.toFixed(2)} €

5. Maksuerä

Maksuerä = lyhennys + korko
Maksuerä = ${amortization.toFixed(2)} + ${interest.toFixed(2)}
Maksuerä = ${payment.toFixed(2)} €

6. Jäljellä oleva saldo

${balanceBefore.toFixed(2)} − ${amortization.toFixed(2)}
= ${remaining.toFixed(2)} €`,
    };
  }

  return {
    result: `Pago total: ${payment.toFixed(2)} €`,
    formula:
`Amortización = K / n
i = interés anual / 12 / 100
Saldo = K − amortización × (cuota − 1)
Interés = saldo × i
Pago = amortización + interés

K = capital inicial
n = número total de cuotas
i = tasa de interés mensual
cuota = número de la cuota que queremos calcular`,
    steps:
`K = ${K.toFixed(2)} €
n = ${n.toFixed(0)}
Interés anual = ${annualRate.toFixed(2)} %
Cuota calculada = ${installment.toFixed(0)}

1. Calculamos la tasa de interés mensual

i = interés anual / 12 / 100
i = ${annualRate.toFixed(2)} / 12 / 100
i = ${i.toFixed(6)}

2. Calculamos la amortización mensual

Amortización = K / n
Amortización = ${K.toFixed(2)} / ${n.toFixed(0)}
Amortización = ${amortization.toFixed(2)} €

3. Calculamos el saldo antes de la cuota ${installment.toFixed(0)}

Saldo = K − amortización × (cuota − 1)
Saldo = ${K.toFixed(2)} − ${amortization.toFixed(2)} × (${installment.toFixed(0)} − 1)
Saldo = ${balanceBefore.toFixed(2)} €

4. Calculamos el interés de la cuota

Interés = saldo × i
Interés = ${balanceBefore.toFixed(2)} × ${i.toFixed(6)}
Interés = ${interest.toFixed(2)} €

5. Calculamos el pago total

Pago = amortización + interés
Pago = ${amortization.toFixed(2)} + ${interest.toFixed(2)}
Pago = ${payment.toFixed(2)} €

6. Calculamos el saldo restante

${balanceBefore.toFixed(2)} − ${amortization.toFixed(2)}
= ${remaining.toFixed(2)} €`,
  };
}


function calculateAnnuityLoan(data, lang) {
  const K = numberValue(data.capital);
  const n = numberValue(data.months);
  const annualRate = numberValue(data.annualInterest);

  if (K < 0 || n <= 0) {
    throw new Error("invalid_input");
  }

  const i = annualRate / 12 / 100;

  const payment =
    i === 0
      ? K / n
      : (K * i) / (1 - Math.pow(1 + i, -n));

  const firstInterest = K * i;
  const firstAmortization = payment - firstInterest;
  const remaining = K - firstAmortization;

  if (lang === "FI") {
    return {
      result: `Kuukausierä: ${payment.toFixed(2)} €`,
      formula:
`i = vuosikorko / 12 / 100
A = (K × i) / (1 − (1 + i)^(-n))

K = lainapääoma
i = kuukausikorko
n = maksuerien määrä
A = vakio maksuerä`,
      steps:
`1. Kuukausikorko

i = vuosikorko / 12 / 100
i = ${annualRate.toFixed(2)} / 12 / 100
i = ${i.toFixed(6)}

2. Annuiteetin laskeminen

A = (K × i) / (1 − (1 + i)^(-n))

A = (${K.toFixed(2)} × ${i.toFixed(6)}) /
    (1 − (1 + ${i.toFixed(6)})^(-${n.toFixed(0)}))

A = ${payment.toFixed(2)} €

3. Ensimmäisen erän korko

Korko = K × i
Korko = ${firstInterest.toFixed(2)} €

4. Ensimmäisen erän lyhennys

Lyhennys = A − korko
Lyhennys = ${firstAmortization.toFixed(2)} €

5. Jäljellä oleva saldo

Saldo = K − lyhennys
Saldo = ${remaining.toFixed(2)} €`,
    };
  }

  return {
    result: `Cuota mensual fija: ${payment.toFixed(2)} €`,
    formula:
`i = interés anual / 12 / 100
A = (K × i) / (1 − (1 + i)^(-n))

K = capital inicial
i = tasa de interés mensual
n = número de cuotas
A = cuota fija`,
    steps:
`1. Calculamos la tasa de interés mensual

i = interés anual / 12 / 100
i = ${annualRate.toFixed(2)} / 12 / 100
i = ${i.toFixed(6)}

2. Calculamos la cuota fija

A = (K × i) / (1 − (1 + i)^(-n))

A = (${K.toFixed(2)} × ${i.toFixed(6)}) /
    (1 − (1 + ${i.toFixed(6)})^(-${n.toFixed(0)}))

A = ${payment.toFixed(2)} €

3. Calculamos el interés de la primera cuota

Interés = K × i
Interés = ${firstInterest.toFixed(2)} €

4. Calculamos la amortización de la primera cuota

Amortización = A − interés
Amortización = ${firstAmortization.toFixed(2)} €

5. Calculamos el saldo restante

Saldo = K − amortización
Saldo = ${remaining.toFixed(2)} €`,
  };
}


function calculateContribution(data, lang) {
  const sales = numberValue(data.sales);
  const variable = numberValue(data.variableCosts);
  const fixed = numberValue(data.fixedCosts);

  const margin = sales - variable;
  const result = margin - fixed;
  const percent = sales === 0 ? 0 : (margin / sales) * 100;

  if (lang === "FI") {
    return {
      result: `Tulos: ${result.toFixed(2)} €`,
      formula:
`Kate = myyntituotot − muuttuvat kustannukset
Tulos = kate − kiinteät kustannukset
Kateprosentti = kate / myyntituotot × 100`,
      steps:
`1. Kate

Kate = ${sales.toFixed(2)} − ${variable.toFixed(2)}
Kate = ${margin.toFixed(2)} €

2. Tulos

Tulos = ${margin.toFixed(2)} − ${fixed.toFixed(2)}
Tulos = ${result.toFixed(2)} €

3. Kateprosentti

Kateprosentti = ${margin.toFixed(2)} / ${sales.toFixed(2)} × 100
Kateprosentti = ${percent.toFixed(2)} %`,
    };
  }

  return {
    result: `Resultado final: ${result.toFixed(2)} €`,
    formula:
`Margen = ingresos por ventas − costes variables
Resultado = margen − costes fijos
Margen % = margen / ingresos por ventas × 100`,
    steps:
`1. Margen de contribución

Margen = ${sales.toFixed(2)} − ${variable.toFixed(2)}
Margen = ${margin.toFixed(2)} €

2. Resultado

Resultado = ${margin.toFixed(2)} − ${fixed.toFixed(2)}
Resultado = ${result.toFixed(2)} €

3. Porcentaje de margen

Margen % = ${margin.toFixed(2)} / ${sales.toFixed(2)} × 100
Margen % = ${percent.toFixed(2)} %`,
  };
}


function calculateIndex(data, lang) {
  const oldValue = numberValue(data.oldValue);
  const newValue = numberValue(data.newValue);

  if (oldValue === 0) {
    throw new Error("invalid_input");
  }

  const absolute = newValue - oldValue;
  const percent = (absolute / oldValue) * 100;

  if (lang === "FI") {
    return {
      result: `Prosenttimuutos: ${percent.toFixed(2)} %`,
      formula:
`Muutos % = (uusi arvo − vanha arvo) / vanha arvo × 100`,
      steps:
`1. Absoluuttinen muutos

Muutos = ${newValue.toFixed(2)} − ${oldValue.toFixed(2)}
Muutos = ${absolute.toFixed(2)}

2. Prosenttimuutos

Muutos % = (${newValue.toFixed(2)} − ${oldValue.toFixed(2)}) / ${oldValue.toFixed(2)} × 100

Muutos % = ${percent.toFixed(2)} %`,
    };
  }

  return {
    result: `Cambio porcentual: ${percent.toFixed(2)} %`,
    formula:
`Cambio % = (valor nuevo − valor antiguo) / valor antiguo × 100`,
    steps:
`1. Cambio absoluto

Cambio = ${newValue.toFixed(2)} − ${oldValue.toFixed(2)}
Cambio = ${absolute.toFixed(2)}

2. Cambio porcentual

Cambio % = (${newValue.toFixed(2)} − ${oldValue.toFixed(2)}) / ${oldValue.toFixed(2)} × 100

Cambio % = ${percent.toFixed(2)} %`,
  };
}


function calculateInflation(data, lang) {
  const first = numberValue(data.cpiInitial);
  const second = numberValue(data.cpiFinal);
  const years = numberValue(data.years);

  if (first <= 0 || second <= 0 || years <= 0) {
    throw new Error("invalid_input");
  }

  const total = (second / first) * 100 - 100;
  const q = Math.pow(second / first, 1 / years);
  const annual = (q - 1) * 100;

  if (lang === "FI") {
    return {
      result: `Kokonaisinflaatio: ${total.toFixed(2)} %`,
      formula:
`Hintojen nousu % = (KHI2 / KHI1 × 100) − 100
q = (KHI2 / KHI1)^(1/n)
Vuotuinen inflaatio % = (q − 1) × 100`,
      steps:
`1. Kokonaisinflaatio

= (${second.toFixed(2)} / ${first.toFixed(2)} × 100) − 100
= ${total.toFixed(2)} %

2. Vuotuinen kerroin

q = (${second.toFixed(2)} / ${first.toFixed(2)})^(1/${years.toFixed(2)})
q = ${q.toFixed(6)}

3. Vuotuinen inflaatio

(q − 1) × 100
= ${annual.toFixed(2)} %`,
    };
  }

  return {
    result: `Inflación total: ${total.toFixed(2)} %`,
    formula:
`Inflación total % = (IPC2 / IPC1 × 100) − 100
q = (IPC2 / IPC1)^(1/n)
Inflación anual % = (q − 1) × 100`,
    steps:
`1. Inflación total

= (${second.toFixed(2)} / ${first.toFixed(2)} × 100) − 100
= ${total.toFixed(2)} %

2. Factor anual

q = (${second.toFixed(2)} / ${first.toFixed(2)})^(1/${years.toFixed(2)})
q = ${q.toFixed(6)}

3. Inflación anual

(q − 1) × 100
= ${annual.toFixed(2)} %`,
  };
}


function calculateProbability(data, lang) {
  const favorable = numberValue(data.favorableCases);
  const total = numberValue(data.totalCases);

  if (
    total <= 0 ||
    favorable < 0 ||
    favorable > total
  ) {
    throw new Error("invalid_input");
  }

  const probability = favorable / total;
  const percent = probability * 100;

  if (lang === "FI") {
    return {
      result: `P = ${probability.toFixed(4)} = ${percent.toFixed(2)} %`,
      formula:
`P = suotuisat tapaukset / kaikki mahdolliset tapaukset`,
      steps:
`P = ${favorable.toFixed(2)} / ${total.toFixed(2)}

P = ${probability.toFixed(4)}

P × 100 = ${percent.toFixed(2)} %`,
    };
  }

  return {
    result: `P = ${probability.toFixed(4)} = ${percent.toFixed(2)} %`,
    formula:
`P = casos favorables / casos totales`,
    steps:
`P = ${favorable.toFixed(2)} / ${total.toFixed(2)}

P = ${probability.toFixed(4)}

P × 100 = ${percent.toFixed(2)} %`,
  };
}


function calculateLinearEquation(data, lang) {
  const a = numberValue(data.a);
  const b = numberValue(data.b);
  const c = numberValue(data.c);

  if (a === 0) {
    throw new Error("invalid_input");
  }

  const x = (c - b) / a;

  if (lang === "FI") {
    return {
      result: `x = ${x.toFixed(4)}`,
      formula:
`ax + b = c
x = (c − b) / a`,
      steps:
`${a.toFixed(2)}x + ${b.toFixed(2)} = ${c.toFixed(2)}

1. Vähennetään b molemmilta puolilta

${a.toFixed(2)}x = ${c.toFixed(2)} − ${b.toFixed(2)}

2. Jaetaan a:lla

x = (${c.toFixed(2)} − ${b.toFixed(2)}) / ${a.toFixed(2)}

x = ${x.toFixed(4)}`,
    };
  }

  return {
    result: `x = ${x.toFixed(4)}`,
    formula:
`ax + b = c
x = (c − b) / a`,
    steps:
`${a.toFixed(2)}x + ${b.toFixed(2)} = ${c.toFixed(2)}

1. Restamos b en ambos lados

${a.toFixed(2)}x = ${c.toFixed(2)} − ${b.toFixed(2)}

2. Dividimos por a

x = (${c.toFixed(2)} − ${b.toFixed(2)}) / ${a.toFixed(2)}

x = ${x.toFixed(4)}`,
  };
}


function calculateQuadraticEquation(data, lang) {
  const a = numberValue(data.a);
  const b = numberValue(data.b);
  const c = numberValue(data.c);

  if (a === 0) {
    throw new Error("invalid_input");
  }

  const D = b ** 2 - 4 * a * c;

  let result;
  let solutionSteps;

  if (D > 0) {
    const sqrtD = Math.sqrt(D);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    result = `x1 = ${x1.toFixed(4)}, x2 = ${x2.toFixed(4)}`;

    solutionSteps =
`√D = ${sqrtD.toFixed(4)}

x1 = ${x1.toFixed(4)}
x2 = ${x2.toFixed(4)}`;
  } else if (D === 0) {
    const x = -b / (2 * a);
    result = `x = ${x.toFixed(4)}`;
    solutionSteps = `x = ${x.toFixed(4)}`;
  } else {
    result =
      lang === "FI"
        ? "Ei reaalisia ratkaisuja"
        : "No hay soluciones reales";

    solutionSteps =
      lang === "FI"
        ? "D < 0, joten yhtälöllä ei ole reaalisia ratkaisuja."
        : "D < 0, por lo tanto la ecuación no tiene soluciones reales.";
  }

  return {
    result,
    formula:
`ax² + bx + c = 0
D = b² − 4ac
x = (−b ± √D) / (2a)`,
    steps:
`${a.toFixed(2)}x² + ${b.toFixed(2)}x + ${c.toFixed(2)} = 0

D = b² − 4ac

D = (${b.toFixed(2)})² − 4 × ${a.toFixed(2)} × ${c.toFixed(2)}

D = ${D.toFixed(2)}

${solutionSteps}`,
  };
}


function calculateTrigonometry(data, lang) {
  const opposite = numberValue(data.opposite);
  const adjacent = numberValue(data.adjacent);

  if (opposite < 0 || adjacent <= 0) {
    throw new Error("invalid_input");
  }

  const tangent = opposite / adjacent;
  const angle = Math.atan(tangent) * (180 / Math.PI);

  if (lang === "FI") {
    return {
      result: `Kulma A: ${angle.toFixed(2)}°`,
      formula:
`tan A = vastakkainen kateetti / viereinen kateetti
A = arctan(vastakkainen / viereinen)`,
      steps:
`tan A = ${opposite.toFixed(2)} / ${adjacent.toFixed(2)}

tan A = ${tangent.toFixed(6)}

A = arctan(${tangent.toFixed(6)})

A = ${angle.toFixed(2)}°`,
    };
  }

  return {
    result: `Ángulo A: ${angle.toFixed(2)}°`,
    formula:
`tan A = cateto opuesto / cateto adyacente
A = arctan(opuesto / adyacente)`,
    steps:
`tan A = ${opposite.toFixed(2)} / ${adjacent.toFixed(2)}

tan A = ${tangent.toFixed(6)}

A = arctan(${tangent.toFixed(6)})

A = ${angle.toFixed(2)}°`,
  };
}


function calculateExponential(data, lang) {
  const k = numberValue(data.initialValue);
  const a = numberValue(data.factor);
  const t = numberValue(data.time);

  if (a < 0 && !Number.isInteger(t)) {
    throw new Error("invalid_input");
  }

  const power = Math.pow(a, t);
  const value = k * power;

  let trend;

  if (lang === "FI") {
    if (a > 1) trend = "Kasvu";
    else if (a > 0 && a < 1) trend = "Väheneminen";
    else if (a === 1) trend = "Vakio";
    else trend = "Vaihtuva etumerkki";

    return {
      result: `f(t) = ${value.toFixed(4)}`,
      formula:
`f(t) = k · a^t

k = alkuarvo
a = kasvu- tai vähenemiskerroin
t = aika`,
      steps:
`f(t) = ${k.toFixed(2)} · ${a.toFixed(4)}^${t.toFixed(2)}

a^t = ${power.toFixed(6)}

f(t) = ${value.toFixed(4)}

Funktion tyyppi:
${trend}`,
    };
  }

  if (a > 1) trend = "Crecimiento";
  else if (a > 0 && a < 1) trend = "Decrecimiento";
  else if (a === 1) trend = "Constante";
  else trend = "Signo alternante";

  return {
    result: `f(t) = ${value.toFixed(4)}`,
    formula:
`f(t) = k · a^t

k = valor inicial
a = factor de crecimiento o decrecimiento
t = tiempo`,
    steps:
`f(t) = ${k.toFixed(2)} · ${a.toFixed(4)}^${t.toFixed(2)}

a^t = ${power.toFixed(6)}

f(t) = ${value.toFixed(4)}

Tipo de función:
${trend}`,
  };
}
