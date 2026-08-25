function roundMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error("invalid_money");
  }

  const sign = number < 0 ? -1 : 1;

  return (
    sign *
    Math.round((Math.abs(number) + 1e-10) * 100) /
    100
  );
}

function formatMoney(value) {
  return roundMoney(value).toFixed(2);
}

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
      result: `Tulos: ${formatMoney(result)} €`,
      formula:
`Kate = myyntituotot − muuttuvat kustannukset
Tulos = kate − kiinteät kustannukset
Kateprosentti = kate / myyntituotot × 100`,
      steps:
`1. Kate

Kate = ${formatMoney(sales)} − ${variable.toFixed(2)}
Kate = ${formatMoney(margin)} €

2. Tulos

Tulos = ${formatMoney(margin)} − ${formatMoney(fixed)}
Tulos = ${formatMoney(result)} €

3. Kateprosentti

Kateprosentti = ${formatMoney(margin)} / ${formatMoney(sales)} × 100
Kateprosentti = ${percent.toFixed(2)} %`,
    };
  }

  return {
    result: `Resultado final: ${formatMoney(result)} €`,
    formula:
`Margen = ingresos por ventas − costes variables
Resultado = margen − costes fijos
Margen % = margen / ingresos por ventas × 100`,
    steps:
`1. Margen de contribución

Margen = ${formatMoney(sales)} − ${variable.toFixed(2)}
Margen = ${formatMoney(margin)} €

2. Resultado

Resultado = ${formatMoney(margin)} − ${formatMoney(fixed)}
Resultado = ${formatMoney(result)} €

3. Porcentaje de margen

Margen % = ${formatMoney(margin)} / ${formatMoney(sales)} × 100
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

function gcd(a, b) { while (b) [a, b] = [b, a % b]; return Math.abs(a); }
function fraction(n, d) { const g = gcd(Math.round(n), Math.round(d)); return `${Math.round(n / g)}/${Math.round(d / g)}`; }

function calculateSystem(data, lang) {
  const v = Object.values(data).map(numberValue); const [a1,b1,c1,a2,b2,c2] = v;
  const D = a1*b2-a2*b1, Dx = c1*b2-c2*b1, Dy = a1*c2-a2*c1;
  const es = lang === "EN", fi = lang === "FI";
  const words = es ? {unique:"Unique solution", none:"No solution", infinite:"Infinitely many solutions", determinant:"Determinant", xnum:"Numerator for x", ynum:"Numerator for y"} : fi ? {unique:"Yksi ratkaisu", none:"Ei ratkaisua", infinite:"Äärettömän monta ratkaisua", determinant:"Determinantti", xnum:"x:n osoittaja", ynum:"y:n osoittaja"} : {unique:"Solución única", none:"Sin solución", infinite:"Infinitas soluciones", determinant:"Determinante", xnum:"Numerador de x", ynum:"Numerador de y"};
  const label = D ? words.unique : (Dx || Dy ? words.none : words.infinite);
  let steps = `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}\n\n${words.determinant} D = a₁b₂ − a₂b₁ = ${D}`;
  if (!D) { steps += `\nDx = ${Dx}, Dy = ${Dy}\n\n${label}.`; return {result: label, formula:"a₁x + b₁y = c₁\na₂x + b₂y = c₂\nD = a₁b₂ − a₂b₁", steps}; }
  const x=Dx/D,y=Dy/D; steps += `\n${words.xnum} Dx = c₁b₂ − c₂b₁ = ${Dx}\n${words.ynum} Dy = a₁c₂ − a₂c₁ = ${Dy}\n\nx = Dx / D = ${x.toFixed(4)}\ny = Dy / D = ${y.toFixed(4)}`;
  return {result:`${label}: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`,formula:"Cramer's rule: x = Dx/D, y = Dy/D",steps};
}

function calculateAdvancedProbability(data, lang) {
  const mode = data.mode;
  const sides = Number(data.sides);
  const sides2 =
    mode === "one"
      ? null
      : Number(data.sides2);

  const kind = data.kind;
  const compare = data.compare || "equal";

  const target =
    kind === "divisible"
      ? null
      : Number(data.target);

  if (!["one", "two", "custom"].includes(mode)) {
    throw new Error("invalid_mode");
  }

  if (!Number.isInteger(sides) || sides < 1) {
    throw new Error("invalid_sides");
  }

  if (
    mode !== "one" &&
    (!Number.isInteger(sides2) || sides2 < 1)
  ) {
    throw new Error("invalid_second_die");
  }

  if (
    kind !== "divisible" &&
    !Number.isFinite(target)
  ) {
    throw new Error("invalid_target");
  }

  const outcomes =
    mode === "one"
      ? Array.from(
          { length: sides },
          (_, index) => [index + 1]
        )
      : Array.from(
          { length: sides * sides2 },
          (_, index) => [
            Math.floor(index / sides2) + 1,
            (index % sides2) + 1,
          ]
        );

  function compareNumber(value) {
    switch (compare) {
      case "greater":
        return value > target;
      case "less":
        return value < target;
      case "greaterEqual":
        return value >= target;
      case "lessEqual":
        return value <= target;
      case "equal":
      default:
        return value === target;
    }
  }

  const favorable = outcomes.filter((outcome) => {
    if (mode === "one") {
      const value = outcome[0];

      switch (kind) {
        case "greater":
          return value > target;
        case "less":
          return value < target;
        case "greaterEqual":
          return value >= target;
        case "lessEqual":
          return value <= target;
        case "equal":
        default:
          return value === target;
      }
    }

    const [a, b] = outcome;

    if (kind === "atleast") {
      return a === target || b === target;
    }

    if (kind === "divisible") {
      return Number.isInteger(a / b);
    }

    if (kind === "product") {
      return compareNumber(a * b);
    }

    return compareNumber(a + b);
  });

  const total = outcomes.length;
  const favorableCount = favorable.length;
  const probability = favorableCount / total;

  const labels =
    lang === "FI"
      ? {
          total: "Kaikki tulokset",
          favorable: "Suotuisat tulokset",
          formula:
            "P = suotuisat tulokset / kaikki tulokset",
        }
      : lang === "ES"
        ? {
            total: "Resultados totales",
            favorable: "Resultados favorables",
            formula:
              "P = resultados favorables / resultados totales",
          }
        : {
            total: "Total outcomes",
            favorable: "Favorable outcomes",
            formula:
              "P = favorable outcomes / total outcomes",
          };

  const favorableText =
    favorable.length <= 36
      ? `\n\n${favorable
          .map((outcome) =>
            mode === "one"
              ? `${outcome[0]}`
              : `(${outcome.join(", ")})`
          )
          .join(", ")}`
      : "";

  return {
    result:
      `P = ${fraction(favorableCount, total)} ` +
      `= ${probability.toFixed(4)} ` +
      `= ${(probability * 100).toFixed(2)} %`,

    formula: labels.formula,

    steps:
      `${labels.total}: ${total}\n` +
      `${labels.favorable}: ${favorableCount}\n` +
      `P = ${favorableCount}/${total} ` +
      `= ${fraction(favorableCount, total)}\n` +
      `P = ${probability.toFixed(4)}\n` +
      `P × 100 = ${(probability * 100).toFixed(2)} %` +
      favorableText,
  };
}

function calculateRightTriangle(data, lang) {
  const o=data.opposite?numberValue(data.opposite):null, a=data.adjacent?numberValue(data.adjacent):null, h=data.hypotenuse?numberValue(data.hypotenuse):null, A=data.angle?numberValue(data.angle):null;
  if (![o,a,h,A].some(v=>v!==null) || [o,a,h,A].some(v=>v!==null&&v<=0) || (A!==null&&A>=90)) throw new Error("invalid_input");
  let O=o, Adj=a, H=h; if(O!==null&&Adj!==null){H=Math.hypot(O,Adj);} else if(A!==null&&Adj!==null){O=Adj*Math.tan(A*Math.PI/180);H=Math.hypot(O,Adj);} else if(A!==null&&O!==null){Adj=O/Math.tan(A*Math.PI/180);H=Math.hypot(O,Adj);} else if(A!==null&&H!==null){O=H*Math.sin(A*Math.PI/180);Adj=H*Math.cos(A*Math.PI/180);} else if(O!==null&&H!==null){Adj=Math.sqrt(H*H-O*O);} else if(Adj!==null&&H!==null){O=Math.sqrt(H*H-Adj*Adj);} else throw new Error("invalid_input");
  const angleA=Math.atan2(O,Adj)*180/Math.PI, angleB=90-angleA;
  const w=lang==="FI"?{o:"vastakkainen",a:"viereinen",h:"hypotenuusa",known:"Tunnetut arvot",sub:"Sijoitetaan tangenttiin tai Pythagoraan lauseeseen"}:lang==="ES"?{o:"opuesto",a:"adyacente",h:"hipotenusa",known:"Valores conocidos",sub:"Sustituimos en la tangente o en Pitágoras"}:{o:"opposite",a:"adjacent",h:"hypotenuse",known:"Known values",sub:"Substitute in tangent or Pythagoras"};
  return {result:`${w.o} = ${O.toFixed(4)}, ${w.a} = ${Adj.toFixed(4)}, ${w.h} = ${H.toFixed(4)}\nA = ${angleA.toFixed(2)}°, B = ${angleB.toFixed(2)}°`,formula:"tan(A) = opposite / adjacent\nh² = opposite² + adjacent²",steps:`${w.known} → ${w.sub}\nh² = ${O.toFixed(4)}² + ${Adj.toFixed(4)}²\nh = ${H.toFixed(4)}\nA = arctan(${O.toFixed(4)} / ${Adj.toFixed(4)}) = ${angleA.toFixed(2)}°\nB = 90° − A = ${angleB.toFixed(2)}°`};
}

function calculateExponentialAdvanced(data) { const k=numberValue(data.k), a=numberValue(data.a); if(k<=0||a<=0||a===1) throw new Error("invalid_input"); if(data.target){const target=numberValue(data.target); if(target<=0) throw new Error("invalid_input"); const t=Math.log(target/k)/Math.log(a); return {result:`t = ${t.toFixed(4)}`,formula:"t = ln(target / k) / ln(a)",steps:`k·a^t = target\n${a}^t = ${target} / ${k}\nt = ln(${target}/${k}) / ln(${a})\nt = ${t.toFixed(4)}`};} const t=numberValue(data.t), value=k*Math.pow(a,t); return {result:`f(${t}) = ${value.toFixed(4)}`,formula:"f(t) = k · a^t",steps:`f(${t}) = ${k} · ${a}^${t}\nf(${t}) = ${value.toFixed(4)}`}; }



function calculateIndexedValue(data, lang) {
  const oldValue = numberValue(data.oldValue);
  const oldIndex = numberValue(data.oldIndex);
  const newIndex = numberValue(data.newIndex);

  if (oldIndex === 0) throw new Error("invalid_input");

  const value = oldValue * newIndex / oldIndex;

  const L =
    lang === "FI"
      ? {
          formula: "uusi arvo = vanha arvo × uusi indeksi / vanha indeksi",
        }
      : lang === "EN"
      ? {
          formula: "new value = old value × new index / old index",
        }
      : {
          formula: "valor nuevo = valor antiguo × índice nuevo / índice antiguo",
        };

  return {
    result: value.toFixed(2),
    formula: L.formula,
    steps:
      `${oldValue} × ${newIndex} / ${oldIndex}\n` +
      `= ${value.toFixed(2)}`,
  };
}


function calculateBase100(data, lang) {
  const values = String(data.values)
    .split(/[;\n|]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map(numberValue);

  if (
    values.length < 2 ||
    values.length > 6 ||
    values[0] === 0
  ) {
    throw new Error("invalid_input");
  }

  const indexes = values.map(
    (value) => value / values[0] * 100
  );

  const change =
    (values[values.length - 1] / values[0] - 1) * 100;

  const L =
    lang === "FI"
      ? {
          base: "Perusarvo",
          change: "Muutos perusarvosta viimeiseen",
          formula: "indeksi = arvo / perusarvo × 100",
        }
      : lang === "EN"
      ? {
          base: "Base value",
          change: "Change from base to final",
          formula: "index = value / base value × 100",
        }
      : {
          base: "Valor base",
          change: "Cambio desde la base hasta el valor final",
          formula: "índice = valor / valor base × 100",
        };

  return {
    result: `${change.toFixed(2)} %`,
    formula: L.formula,
    steps:
      `${L.base}: ${values[0].toFixed(2)} = 100\n` +
      indexes
        .map(
          (index, i) =>
            `${i + 1}: ${values[i].toFixed(2)} → ${index.toFixed(2)}`
        )
        .join("\n") +
      `\n${L.change}: ${change.toFixed(2)} %`,
  };
}


function calculateUnitContribution(data, lang) {
  const quantity = numberValue(data.quantity);
  const price = numberValue(data.price);
  const variable = numberValue(data.variable);
  const fixed = numberValue(data.fixed);

  if (
    quantity < 0 ||
    price < 0 ||
    variable < 0 ||
    fixed < 0
  ) {
    throw new Error("invalid_input");
  }

  const sales = quantity * price;
  const costs = quantity * variable;
  const margin = sales - costs;
  const result = margin - fixed;

  const pct = (value) =>
    sales ? value / sales * 100 : 0;

  const L =
    lang === "FI"
      ? {
          sales: "Myyntituotot",
          variable: "Muuttuvat kustannukset",
          margin: "Kate",
          fixed: "Kiinteät kustannukset",
          result: "Tulos",
        }
      : lang === "EN"
      ? {
          sales: "Sales revenue",
          variable: "Variable costs",
          margin: "Contribution margin",
          fixed: "Fixed costs",
          result: "Result",
        }
      : {
          sales: "Ingresos por ventas",
          variable: "Costes variables",
          margin: "Margen de contribución",
          fixed: "Costes fijos",
          result: "Resultado",
        };

  return {
    result: `${L.result}: ${formatMoney(result)} €`,
    formula:
      "sales = quantity × price\n" +
      "variable costs = quantity × variable cost\n" +
      "margin = sales − variable costs\n" +
      "result = margin − fixed costs",
    steps:
      `${L.sales} = ${quantity} × ${formatMoney(price)} € = ${formatMoney(sales)} €\n` +
      `${L.variable} = ${quantity} × ${formatMoney(variable)} € = ${formatMoney(costs)} €\n` +
      `${L.margin} = ${formatMoney(margin)} € (${pct(margin).toFixed(2)} %)\n` +
      `${L.fixed} = ${formatMoney(fixed)} € (${pct(fixed).toFixed(2)} %)\n` +
      `${L.result} = ${formatMoney(result)} €`,
  };
}


function calculateVat(data, lang) {
  const amount = numberValue(data.amount);
  const rate = numberValue(data.rate);

  if (amount < 0 || rate < 0) {
    throw new Error("invalid_input");
  }

  const factor = 1 + rate / 100;

  const net =
    data.mode === "gross"
      ? amount / factor
      : amount;

  const gross =
    data.mode === "gross"
      ? amount
      : amount * factor;

  const vat = gross - net;

  const L =
    lang === "FI"
      ? { net: "Netto", vat: "ALV", gross: "Brutto" }
      : lang === "EN"
      ? { net: "Net", vat: "VAT", gross: "Gross" }
      : { net: "Neto", vat: "IVA", gross: "Bruto" };

  return {
    result:
      `${L.net} = ${formatMoney(net)}, ` +
      `${L.vat} = ${formatMoney(vat)}, ` +
      `${L.gross} = ${formatMoney(gross)}`,

    formula:
      data.mode === "gross"
        ? "net = gross / (1 + rate)"
        : "gross = net × (1 + rate)\nVAT = gross − net",

    steps:
      `${L.net}: ${formatMoney(net)}\n` +
      `${L.vat}: ${formatMoney(vat)}\n` +
      `${L.gross}: ${formatMoney(gross)}`,
  };
}


function calculateTaxedGrowth(data, lang) {
  const start = numberValue(data.start);
  const rate = numberValue(data.rate) / 100;
  const taxRate = numberValue(data.tax) / 100;
  const years = numberValue(data.years);

  if (
    start < 0 ||
    rate < 0 ||
    taxRate < 0 ||
    years < 1 ||
    years > 100 ||
    !Number.isInteger(years)
  ) {
    throw new Error("invalid_input");
  }

  let capital = start;
  const rows = [];

  for (let year = 1; year <= years; year += 1) {
    const opening = capital;
    const interest = opening * rate;
    const tax = interest * taxRate;
    const netInterest = interest - tax;

    capital = opening + netInterest;

    rows.push({
      year,
      opening,
      interest,
      tax,
      netInterest,
      closing: capital,
    });
  }

  const L =
    lang === "FI"
      ? {
          final: "Loppupääoma",
          year: "Vuosi",
          opening: "Alkupääoma",
          interest: "Korko",
          tax: "Vero",
          closing: "Loppupääoma",
        }
      : lang === "EN"
      ? {
          final: "Final capital",
          year: "Year",
          opening: "Opening capital",
          interest: "Interest",
          tax: "Tax",
          closing: "Closing capital",
        }
      : {
          final: "Capital final",
          year: "Año",
          opening: "Capital inicial",
          interest: "Interés",
          tax: "Impuesto",
          closing: "Capital final",
        };

  return {
    result: `${L.final}: ${capital.toFixed(4)}`,
    formula:
      "interest = capital × annual rate\n" +
      "tax = interest × tax rate\n" +
      "new capital = capital + interest − tax",

    steps: rows
      .map(
        (row) =>
          `${L.year} ${row.year}\n` +
          `${L.opening}: ${row.opening.toFixed(4)}\n` +
          `${L.interest}: ${row.interest.toFixed(4)}\n` +
          `${L.tax}: ${row.tax.toFixed(4)}\n` +
          `${L.closing}: ${row.closing.toFixed(4)}`
      )
      .join("\n\n"),

    rows,
  };
}

function calculateLoanSchedule(data) {
  const K=numberValue(data.capital), n=numberValue(data.months), annual=numberValue(data.annualInterest), selected=numberValue(data.installment||1); if(K<0||n<1||selected<1||selected>n) throw new Error("invalid_input"); const i=annual/1200, amort=K/n, rows=[]; let balance=K,totalInterest=0;
  for(let number=1;number<=n;number++){const opening=balance, interest=opening*i, payment=amort+interest; balance=Math.max(0,opening-amort); totalInterest+=interest; rows.push({number,opening,amortization:amort,interest,payment,remaining:balance});}
  return {rows,selected:rows[selected-1],first:rows[0],second:rows[Math.min(1,n-1)],last:rows[n-1],totalInterest,totalPaid:K+totalInterest};
}
function calculateAnnuityDetails(data) { const K=numberValue(data.capital), n=numberValue(data.months), annual=numberValue(data.annualInterest), selected=numberValue(data.installment||1); if(K<0||n<1||selected<1||selected>n) throw new Error("invalid_input"); const i=annual/1200, payment=i===0?K/n:K*i/(1-Math.pow(1+i,-n)), rows=[]; let balance=K; for(let number=1;number<=n;number++){const opening=balance, interest=opening*i, principal=Math.min(payment-interest,opening); balance=Math.max(0,opening-principal); rows.push({number,opening,interest,principal,payment:principal+interest,remaining:balance});} const totalPaid=rows.reduce((s,r)=>s+r.payment,0); return {payment,rows,first:rows[0],selected:rows[selected-1],last:rows[n-1],totalPaid,totalInterest:totalPaid-K}; }


function signedAlgebraTerm(value, suffix = "", decimals = 2) {
  const number = Number(value);
  const absolute = Math.abs(number).toFixed(decimals);

  return number < 0
    ? ` − ${absolute}${suffix}`
    : ` + ${absolute}${suffix}`;
}

function subtractAlgebraTerm(value, decimals = 2) {
  const number = Number(value);
  const absolute = Math.abs(number).toFixed(decimals);

  return number < 0
    ? `+ ${absolute}`
    : `− ${absolute}`;
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
`${a.toFixed(2)}x${signedAlgebraTerm(b)} = ${c.toFixed(2)}

1. Vähennetään b molemmilta puolilta

${a.toFixed(2)}x = ${c.toFixed(2)} ${subtractAlgebraTerm(b)}

2. Jaetaan a:lla

x = (${c.toFixed(2)} ${subtractAlgebraTerm(b)}) / ${a.toFixed(2)}

x = ${x.toFixed(4)}`,
    };
  }

  return {
    result: `x = ${x.toFixed(4)}`,
    formula:
`ax + b = c
x = (c − b) / a`,
    steps:
`${a.toFixed(2)}x${signedAlgebraTerm(b)} = ${c.toFixed(2)}

1. Restamos b en ambos lados

${a.toFixed(2)}x = ${c.toFixed(2)} ${subtractAlgebraTerm(b)}

2. Dividimos por a

x = (${c.toFixed(2)} ${subtractAlgebraTerm(b)}) / ${a.toFixed(2)}

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
`${a.toFixed(2)}x²${signedAlgebraTerm(b, "x")}${signedAlgebraTerm(c)} = 0

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
